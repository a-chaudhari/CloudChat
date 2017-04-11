require 'em-websocket'
require 'socket'
require 'json'
require_relative 'ruby1459/irc_connection'
require_relative 'ruby1459/irc_channel'
require_relative 'control_side'
require 'byebug'
require_relative 'user'
Thread.abort_on_exception = true

class Server


  def initialize
    @ws = nil
    @active_clients = {}
    @active_tokens={}
    Thread.new do
      createClientChannel
    end
    @control_socket = createControlChannel
    loop{
      sleep(1000)
    }
  end



  def authorized?(session)
    @authorized_sessions.includes?(session)
  end

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
              user.connection.joinedChannels.first.last.speak(msg)
              # ws.send "Pong: #{msg}"


            }
            @active_tokens.delete(token)
          end
          # ws.close
        }

        ws.onclose { puts "Connection closed" }

      end
    }
  end

end


s = Server.new
