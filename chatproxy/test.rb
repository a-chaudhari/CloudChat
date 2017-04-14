require 'socket'
require 'json'

class Test
  def initialize

  end


  def run
    socket = TCPSocket.new('127.0.0.1', 2000)
    # socket.open
    command = {
      command: "start",
      username: "achaudhari",
      settings:{
        server: "irc.freenode.net",
        nickname: "milo3893",
        port: 6667,
        serverpass: "",
        username: "user",
        full_name: "user name",
        channels: ['#test1115','#test11152']
      }
    }
    socket.puts(command.to_json)
    command = {
      command: "start",
      username: "achaudhari",
      settings:{
        server: "card.freenode.net",
        nickname: "milo3893v2",
        port: 6667,
        serverpass: "",
        username: "user",
        full_name: "user name",
        channels: ['#test1115']
      }
    }
    socket.puts(command.to_json)

    command = {
      command: "update",
      username: "achaudhari",
      token: "abcd1234"
    }

    socket.puts(command.to_json)

    command = {
      command: "start",
      username: "someoneelse",
      settings:{
        nickname: "anoter2823",
        port: 6667,
        serverpass: "",
        username: "user",
        full_name: "user name",
        channels: ['#test11152']
      }
    }
    socket.puts(command.to_json)

    command = {
      command: "update",
      username: "someoneelse",
      token: "abcd12342"
    }

    socket.puts(command.to_json)

    p socket.gets
  end



end



test = Test.new
test.run
