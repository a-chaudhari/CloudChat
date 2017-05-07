def createControlChannel
  server = UNIXServer.new('/tmp/chatproxy.sock')
  # server = TCPServer.new 2000
  # client = sock.accept

  p 'started chat proxy'

  loop do
    Thread.fork(server.accept) do |client|
      loop do
        msg = client.gets
        break if msg.nil?
        p msg
        msg = msg.chomp
        processControlChannel(msg, client)
      end
    end
  end

  server
end

def processControlChannel(msg, client)
  hash = JSON.parse(msg)
  case hash["command"]
  when "start"
    start(hash)
  when "kill"
    kill(hash)
  when "update"
    update(hash)
  end
end

def bind_events_to_channel(user, server_url, chan)
  chan.on(:chanmsg) do |data|
    data[:msg] = Base64.encode64(data[:msg])
    data[:server] = server_url
    data[:command] = "chanmsg"
    user.appendBuffer(data)
    user.send_all(data.to_json)
  end

  chan.on(:chan_join) do |data|
    data[:server] = server_url
    # data[:system] = true;
    data[:command] = "chan_join"
    # user.appendBuffer(data)
    user.send_all(data.to_json)
  end

  chan.on(:chan_part) do |data|
    data[:server] = server_url
    data[:command] = "chan_part"
    # data[:system] = true;
    data[:quit_msg] = Base64.encode64(data[:quit_msg])
    # user.appendBuffer(data)
    user.send_all(data.to_json)
  end

  chan.on(:new_topic) do |data|
    data[:server] = server_url
    data[:command] = 'new_topic'
    data[:topic] = Base64.encode64(data[:topic])
    user.send_all(data.to_json)
  end
end

def start(obj)
  settings = obj["settings"]
  username = obj["username"].to_sym
  server_url = settings["server"]

  unless !!@active_clients[username]
    @active_clients[username] = User.new(obj)
  end

  user = @active_clients[username]

  if !!user.connections[server_url]
    #server already exists under this user.  cannot add twice
    return
  end
  # debugger

  user.connections[server_url] = create_irc_connection(settings, user)
  user.connections[server_url].connect
end

def create_irc_connection(settings, user)
  # debugger

  connection = IrcConn.new(
  {
    server: settings["server"],
    port: settings["port"],
    password: settings["serverpass"],
    nickname: settings["nickname"],
    username: settings["username"],
    realname: settings["realname"]
  })
  server_url = connection.server

  # connection.instance_variable_set(:@queries, {})
  # connection.attr_accessor :queries
  # debugger

  connection.on(:registered) do

    #inform the clients of the connected server
    command = {
      command: 'add_server',
      server: connection.server,
      channels: connection.channels.keys,
      nickname: connection.nickname
    }
    user.send_all(command.to_json)

    unless settings['channels'].nil?
      settings["channels"].each do |name|
        # debugger
        chan = connection.createChannel(name)
        bind_events_to_channel(user, server_url, chan)
        # debugger
        user.addBuffer(server_url + " " + name)
        # debugger
        if chan.join == :active
          user.send_all({
            command: 'chan_self_join',
            server: connection.server,
            channel: chan.channel,
            users: chan.userlist,
            query: false,
            topic: Base64.encode64(chan.topic),
            buffer: [],
          }.to_json)
        end
      end
    end
  end

  connection.on(:query) do |data|
    # data[:user] = user
    # data[:server] = connection

    #first open the view if it doesn't exist yet
    unless connection.queries.include?(data[:user])
      user.send_all({
        command: 'chan_self_join',
        server: connection.server,
        channel: data[:user],
        query: true,
        users: [],
        topic: "",
        buffer: []
      }.to_json)

      user.addBuffer(connection.server + " " + data[:user])
      connection.queries.add(data[:user])
    end

    #now send the new message
    data[:msg] = Base64.encode64(data[:msg])
    data[:server] = connection.server
    data[:command] = "chanmsg"
    data[:channel] = data[:user]
    # debugger
    user.appendBuffer(data)
    user.send_all(data.to_json)
  end

  connection.on(:ERR_NOSUCHNICK) do |raw|
    #tried to query a username that isn't online
    # ":kornbluth.freenode.net 401 zelos82 tet823302 :No such nick/channel"
    chunks = raw.split(' ')
    target = chunks[3]
    server_url = connection.server

    command = {
        command: 'chanmsg',
        server: server_url,
        channel: target,
        msg: target + " is not online",
        system: true,
        timestamp: Time.now
    }

    user.appendBuffer(command)
    user.send_all(command.to_json)
  end

  connection
end

def kill(obj)
  username = obj['username'].to_sym
  user = @active_clients[username]
  return if user.nil?

  user.connections.each(&:disconnect)
  user.socket.each(&:close)
  @active_clients.delete(username)

end

def update(obj)
  #the user isn't known to this server
  return false if !@active_clients[obj["username"].to_sym]

  #add the new token to the whitelist
  @active_tokens[obj["token"]] = obj["username"]
end
