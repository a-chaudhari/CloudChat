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
        @ws = ws
        ws.onopen { |handshake|
          debugger
          puts "WebSocket connection open"

          # Access properties on the EM::WebSocket::Handshake object, e.g.
          # path, query_string, origin, headers

          # Publish message to the client
          ws.send "Hello Client, you connected to #{handshake.path}"
        }

        ws.onclose { puts "Connection closed" }

        ws.onmessage { |msg|
          puts "Recieved message: #{msg}"
          ws.send "Pong: #{msg}"
        }
      end
    }
  end

end


s = Server.new
