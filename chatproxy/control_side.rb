def createControlChannel
  # sock = UNIXServer.new('/tmp/chatproxy.sock')
  sock = TCPServer.new 2000
  client = sock.accept
  Thread.new do
    p 'hi'
    # debugger
    loop{
      msg = client.gets
      p msg
      break if msg.nil?
      msg = msg.chomp
      puts "control chan recv: #{msg}"
      processControlChannel(msg)
    }
  end
  sock
end

def processControlChannel(msg)
  hash = JSON.parse(msg)
  case hash["command"]
  when "start"
    start(hash)
  when "kill"
    kill(hash)
  when "update"
    update(hash)
  end
end

def start(obj)
  settings = obj["settings"]
  username = obj["username"].to_sym
  server_url = settings["server"]

  unless !!@active_clients[username]
    @active_clients[username] = User.new(obj)
  end

  user = @active_clients[username]

  if !!user.connections[server_url]
    #server already exists under this user.  cannot add twice
    return
  end

  user.connections[server_url] = IrcConnection.new({
    server: settings["server"],
    port: settings["port"],
    password: settings["serverpass"],
    nickname: settings["nickname"],
    username: settings["username"],
    realname: settings["realname"]
    })

  user.connections[server_url].on(:registered) do
    settings["channels"].each do |name|

      chan = user.connections[server_url].createChannel(name)
      chan.on(:chanmsg) do |data|
        data[:server]=server_url
        data[:command]="chanmsg"
        user.socket.send(data.to_json) unless user.socket.nil?
      end
      chan.join
    end
  end

  user.connections[server_url].connect

  # p "startin"
  # p @active_clients
  # return if !!@active_clients[username] && !!@active_clients[username].connections[server_url]
  # p "past return check"
  # user = User.new(obj) if !@active_clients[username]


  # @active_clients[obj["username"].to_sym] = user
end

def kill(obj)
  #TODO need to add a disconnect funtion to library
end

def update(obj)
  return false if !@active_clients[obj["username"].to_sym]
  # debugger
  @active_tokens[obj["token"]] = obj["username"]
  # @active_clients[obj["username"].to_sym].token = obj["token"]
end
