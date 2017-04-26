class User
  def initialize(params)
    @init_params = params
    @token = ""
    # @connection = ""
    @connections = {}
    @buffers = {}
    @socket = nil
    @username = params["username"]
  end

  attr_accessor :session, :connections, :init_params, :socket
  attr_reader :username, :buffers


  def addBuffer(str)
    @buffers[str] = []
  end

  def delBuffer(str)
    @buffers.delete(str)
  end

  def appendBuffer(hash)
    #need to only save the relevent info.  otherwise we'd have massive buffers!

    #client data has a string as key instead of symbol
    if hash[:server].nil?
      #this is from the  browser, so it's the user sending a message
      channel = hash['channel']
      server = hash['server']
      timestamp = Time.now
      msg = hash['msg']
      user = @connections[server].nickname
    else
      #this is from the irc library, so it's another person speaking
      server = hash[:server]
      channel = hash[:channel]
      timestamp = hash[:timestamp]
      msg = hash[:msg]
      user = hash[:user]
    end
    str = server + " " + channel

    buffer = @buffers[str]
    buffer.shift if buffer.length >= 50

    buffer.push(channel: channel, server: server,
                timestamp: timestamp, msg: msg, user: user)
  end

end
