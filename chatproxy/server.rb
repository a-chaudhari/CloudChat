require 'em-websocket'
require 'socket'
require 'json'
require_relative 'ruby1459/irc_connection'
require_relative 'ruby1459/irc_channel'
require_relative 'control_side'
require_relative 'client_side'
require 'byebug'
require_relative 'user'
require 'base64'
Thread.abort_on_exception = true

#inserts queries support into the ircconnection object
class IrcConn < IrcConnection
  def initialize(*args)
    @queries = Set.new
    super(*args)
  end

  attr_accessor :queries
end

class Server

  def initialize
    @ws = nil
    @active_clients = {}
    @active_tokens = {}

    system('rm /tmp/chatproxy.sock')

    Thread.new do
      createClientChannel
    end
    @control_socket = createControlChannel
  end

  def is_query?(str)
    str[0] !~ /[#!+~&]/
  end

end


Server.new
