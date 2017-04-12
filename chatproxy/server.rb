require 'em-websocket'
require 'socket'
require 'json'
require_relative 'ruby1459/irc_connection'
require_relative 'ruby1459/irc_channel'
require_relative 'control_side'
require_relative 'client_side'
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

end


s = Server.new
