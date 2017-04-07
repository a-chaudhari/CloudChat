# require_relative 'ruby1459/irc_connection'
# require_relative 'ruby1459/irc_channel'

class User
  def initialize(params)
    @init_params = params
    @token = ""
    @connection = ""
    @socket = nil
    @username = params["username"]
  end

  attr_accessor :session, :connection, :init_params, :socket
  attr_reader :username


end
