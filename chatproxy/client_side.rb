def createClientChannel
  EM.run {
    EM::WebSocket.run(:host => "0.0.0.0", :port => 8080) do |ws|
      # @ws = ws
      ws.onopen { |handshake|
        # debugger
        # p handshake.headers["Cookies"]
        puts "WebSocket connection open"

        # Access properties on the EM::WebSocket::Handshake object, e.g.
        # path, query_string, origin, headers

        # Publish message to the client
        ws.send "Hello Client, you connected to #{handshake.path}".to_json
        token = handshake.path
        token[0]=""

        unless !!@active_tokens[token]
          p "token not found, closing"
          ws.send("cannot find your token. disconnecting :(".to_json)
          ws.close
        else
          username = @active_tokens[token]
          user = @active_clients[username.to_sym]
          p "connected user: #{username}"
          ws.send("token found! connecting stream".to_json)
          user.socket = ws
          send_welcome_package(user)
          ws.onmessage { |msg|
            # debugger
            puts "Recieved message: #{msg} from #{user.username}"
            # debugger
            # user.channels.first.last.speak(msg)

            # user.connection.joinedChannels.first.last.speak(msg)
            # ws.send "Pong: #{msg}"
            hash = JSON.parse(msg)
            hash[:user]=user
            process_client_command(hash)

          }
          # @active_tokens.delete(token)
        end
        # ws.close
      }

      ws.onclose { puts "Connection closed" }

    end
  }
end

def process_client_command(hash)
  send(hash["command"].to_sym,hash)
end

def send_welcome_package(user)
  #sends the full current state to a newly connected client
  # debugger
  package = {
    command: 'welcome_package',
    servers: prepare_servers(user.connections)
  }

  p package
  user.socket.send(package.to_json)

end

def prepare_servers(servers)
  output = {}
  servers.each do |key,conn|
    temp = {
      server: conn.server,
      nickname: conn.nickname,
      channels: prepare_channels(conn.channels)
    }
    output[key] = temp
  end
  output
end

def prepare_channels(chans)
  output = {}
  chans.each do |key,chan|
    temp = {
      name: chan.channel,
      users: ["not_impli","not_impli","not_impli"],
      buffer: [{user:"system",msg:"server buffer not implemented... yet"}],
      topic: "topic not implemented"
    }
    output[key] = temp
  end
  output
end

def speak(hash)
  #server
  #channel
  #msg
  user = hash[:user]
  server = user.connections[hash["server"]]
  channel = server.channels[hash["channel"]]
  channel.speak(hash["msg"])
end

def join(hash)
end

def part(hash)
end

def connect(hash)
end

def disconnect(hash)
end

def query(hash)
end
