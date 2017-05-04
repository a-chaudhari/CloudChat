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
    data[:command] = "chan_join"
    user.send_all(data.to_json)
  end

  chan.on(:chan_part) do |data|
    data[:server] = server_url
    data[:command] = "chan_part"
    user.send_all(data.to_json)
  end

  chan.on(:new_topic) do |data|
    data[:server] = server_url
    data[:command] = 'new_topic'
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

  user.connections[server_url] = create_irc_connection(settings, user)
  user.connections[server_url].connect
end

def create_irc_connection(settings, user)
  # debugger

  connection = IrcConnection.new(
  {
    server: settings["server"],
    port: settings["port"],
    password: settings["serverpass"],
    nickname: settings["nickname"],
    username: settings["username"],
    realname: settings["realname"]
  })
  server_url = connection.server

  connection.on(:registered) do
    settings["channels"].each do |name|
      # debugger
      chan = connection.createChannel(name)
      bind_events_to_channel(user, server_url, chan)
      # debugger
      user.addBuffer(server_url + " " + name)
      if chan.join == :active
        user.send_all({
          command: 'chan_self_join',
          server: connection.server,
          channel: chan.channel,
          users: chan.userlist,
          topic: chan.topic,
          buffer: [],
        }.to_json)
      end
    end
  end
  connection
end

def kill(obj)
  #TODO need to add a disconnect funtion to library
end

def update(obj)
  #the user isn't known to this server
  return false if !@active_clients[obj["username"].to_sym]

  #add the new token to the whitelist
  @active_tokens[obj["token"]] = obj["username"]
end
