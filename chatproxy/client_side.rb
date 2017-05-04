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
    temp = {
      server: conn.server,
      nickname: conn.nickname,
      channels: prepare_channels(user, conn.server, conn.channels)
    }
    output[key] = temp
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
      topic: chan.topic
    }
    output[key] = temp
  end
  output
end

def speak(hash)
  user = hash[:user]
  server = user.connections[hash["server"]]
  channel = server.channels[hash["channel"]]

  user.appendBuffer(hash)
  channel.speak(Base64.decode64(hash["msg"]))

  command = {
    command: 'chanmsg',
    server: server.server,
    channel: channel.channel,
    msg: hash["msg"],
    timestamp: Time.now,
    user: server.nickname
  }
  user.send_all(command.to_json)
end

def join(hash)
  user = hash[:user]
  server = user.connections[hash["server"]]

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
      users: channel.userlist,
      topic: channel.topic,
      buffer: [],
    }.to_json)
  end

end

def part(hash)
  user = hash[:user]
  server = user.connections[hash["server"]]
  channel = server.channels[hash["channel"]]

  channel.part
  server.deleteChannel(hash["channel"])

  user.send_all({
    command: 'chan_self_part',
    server: server.server,
    channel: channel.channel
  }.to_json)
end

def connect(hash)
  user = hash[:user]
  server_url = hash['server']

  connection = create_irc_connection(hash, user)
  user.connections[server_url] = connection
  connection.connect

  #now inform the client
  command = {
    command: 'add_server',
    server: server_url,
    channels: connection.channels.keys,
    nickname: hash['nickname']
  }
  user.send_all(command.to_json)
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

  #TODO remove query buffers

  command = {
    command: 'del_server',
    server: server_url
  }

  user.send_all(command.to_json)

end

def query(hash)
end
