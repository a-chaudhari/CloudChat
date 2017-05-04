class Query
  def initialize(server, name)
    @server = server
    @name = name
    @buffer = []
  end

  attr_reader :buffer, :name, :server

  def appendBuffer(obj)
    @buffer.shift if @buffer.length >= 50
    @buffer.push(obj)
  end







end
