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
        ws.send "Hello Client, you connected to #{handshake.path}"
        token = handshake.path
        token[0]=""

        unless !!@active_tokens[token]
          p "token not found, closing"
          ws.send("cannot find your token. disconnecting :(")
          ws.close
        else
          username = @active_tokens[token]
          user = @active_clients[username.to_sym]
          p "connected user: #{username}"
          ws.send("token found! connecting stream")

          @active_clients[@active_tokens[token].to_sym].socket = ws
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
          @active_tokens.delete(token)
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

def welcome_package
  #sends the full current state to a newly connected client

end

def speak(hash)
  #server
  #channel
  #msg
  user = hash[:user]
  server = user.connections[hash["server"]]
  channel = server.channels.channels[hash["channel"]]
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
