require 'json'
require 'socket'
class User < ActiveRecord::Base
  validates :username, :password_digest, :session_token, presence: true
  validates :username, uniqueness: true
  validates :password, length:{allow_nil: true, minimum: 6}

  before_validation :ensure_session_token

  has_many :servers
  has_many :channels,
    through: :servers,
    source: :channels

  attr_reader :password

  def self.find_by_credentials(username,password)
    user = User.find_by(username: username)
    if(user)
      return user if user.is_password?(password)
    end
    nil
  end

  def self.start_connections
    socket = TCPSocket.new('127.0.0.1', 2000)

    User.all.each do |user|
      user.servers.each do |server|
        command = {
          command: "start",
          username: user.username,
          settings:{
            server: server.server_url,
            nickname: server.nickname,
            port: server.port,
            serverpass: server.server_pass,
            username: server.username,
            full_name: server.realname,
            channels: server.channels.map {|c| c.channel_name}
          }
        }
        socket.puts(command.to_json)

      end

    end

  end

  def reset_session_token!
    self.session_token= SecureRandom.urlsafe_base64
    self.save!
    self.session_token
  end

  def ensure_session_token
    self.session_token = SecureRandom.urlsafe_base64
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end


end
