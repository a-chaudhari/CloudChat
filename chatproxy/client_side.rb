def createClientChannel
  EM.run do
    EM::WebSocket.run(host: "0.0.0.0", port: 8080) do |ws|
      ws.onopen do |handshake|
        token = handshake.path
        token[0] = "" #drop leading '/'

        unless !!@active_tokens[token]
          ws.send("cannot find your token. disconnecting :(".to_json)
          ws.close
        else
          username = @active_tokens[token]
          user = @active_clients[username.to_sym]

          ws.send("token found! connecting stream".to_json)
          user.add_socket(ws)
          send_welcome_package(user)

          ws.onmessage do |msg|
            p msg
            hash = JSON.parse(msg)
            hash[:user] = user
            process_client_command(hash)
          end

          ws.onclose { user.clear_disconnected_sockets }

          @active_tokens.delete(token)
        end
      end



    end
  end
end

def process_client_command(hash)
  return if hash['command'].nil?
  send(hash["command"].to_sym, hash)
end

def send_welcome_package(user)
  #sends the full current state to a newly connected client
  # debugger
  package = {
    command: 'welcome_package',
    servers: prepare_servers(user, user.connections)
  }

  p package
  user.send_all(package.to_json)

end

def prepare_servers(user, servers)
  output = {}
  servers.each do |key, conn|
    channels = prepare_channels(user, conn.server, conn.channels)
    queries = prepare_queries(user, conn)
    temp = {
      server: conn.server,
      nickname: conn.nickname,
      channels: channels.merge(queries)
    }
    output[key] = temp
  end
  output
end

def prepare_queries(user, server)
  output = {}
  server.queries.each do |name|
    str = server.server + " " + name
    temp = {
      name: name,
      users: [],
      query: true,
      buffer: user.buffers[str],
      topic: Base64.encode64("")
    }
    output[name] = temp
  end
  output
end

def prepare_channels(user, server, chans)
  output = {}
  chans.each do |key, chan|
    temp = {
      name: chan.channel,
      users: chan.userlist,
      buffer: user.buffers[server + ' ' + key],
      topic: Base64.encode64(chan.topic),
      query: false
    }
    output[key] = temp
  end
  output
end

def speak(hash)
  user = hash[:user]
  server = user.connections[hash["server"]]
  if is_query?(hash['channel'])
    if hash['emote']
      server.query_emote(hash['channel'], Base64.decode64(hash["msg"]))
    else
      server.query(hash['channel'], Base64.decode64(hash["msg"]))
    end
  else
    channel = server.channels[hash["channel"]]
    if hash['emote']
      channel.emote(Base64.decode64(hash["msg"]))
    else
      channel.speak(Base64.decode64(hash["msg"]))
    end
  end

  user.appendBuffer(hash)

  command = {
    command: 'chanmsg',
    server: server.server,
    channel: hash['channel'],
    msg: hash["msg"],
    timestamp: Time.now,
    emote: hash['emote'],
    user: server.nickname
  }
  user.send_all(command.to_json)
end

def join(hash)
  user = hash[:user]
  server = user.connections[hash["server"]]

  #first see if it a query or chan join
  if is_query?(hash['channel'])
    query(hash)
    return
  end

  #don't try to join a channel twice
  return if !!server.channels[hash['channel']]

  channel = server.createChannel(hash['channel'])
  bind_events_to_channel(user, server.server, channel)

  user.addBuffer(server.server + " " + channel.channel)
  if channel.join == :active
    #inform the client if connected
    user.send_all({
      command: 'chan_self_join',
      server: server.server,
      channel: channel.channel,
      query: false,
      users: channel.userlist,
      topic: Base64.encode64(channel.topic),
      buffer: []
    }.to_json)
  end

end

def part(hash)
  user = hash[:user]
  server = user.connections[hash["server"]]
  channel = hash['channel']

  if is_query?(hash['channel'])
    server.queries.delete(channel)
  else
    server.deleteChannel(channel)
  end

  str = server.server + " " + channel
  user.buffers.delete(str)

  user.send_all({
    command: 'chan_self_part',
    server: server.server,
    channel: channel
  }.to_json)
end

def connect(hash)
  user = hash[:user]
  server_url = hash['server']

  connection = create_irc_connection(hash, user)
  user.connections[server_url] = connection
  connection.connect


end

def disconnect(hash)
  user = hash[:user]
  server_url = hash['server']
  connection = user.connections[server_url]

  connection.disconnect

  user.buffers.each do |k, _|
    chunks = k.split(' ')
    if chunks[0] == server_url
      user.delBuffer(k)
    end
  end
  user.connections.delete(server_url)

  command = {
    command: 'del_server',
    server: server_url
  }

  user.send_all(command.to_json)
  # debugger

end

def debug(hash)
  debugger
end

def query(hash)
  user = hash[:user]
  server = user.connections[hash["server"]]
  target = hash['channel']

  #don't try to join a channel twice
  return if server.queries.include?(target)

  user.addBuffer(server.server + " " + target)
  server.queries.add(target)

  #inform the client if connected
  user.send_all({
    command: 'chan_self_join',
    server: server.server,
    channel: target,
    query: true,
    users: [],
    topic: Base64.encode64(""),
    buffer: [],
  }.to_json)

end
