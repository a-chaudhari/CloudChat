class User < ActiveRecord::Base
  validates :username, :password_digest, :session_token, presence: true
  validates :username, uniqueness: true
  validates :password, length:{allow_nil: true, minimum: 6}

  before_validation :ensure_session_token

  attr_reader :password

  def self.find_by_credentials(email,password)
      user = User.find_by(email: email)
      if(user)
        return user if user.is_password?(password)
      end
      nil
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
