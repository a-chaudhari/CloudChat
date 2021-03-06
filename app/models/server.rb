class Server < ActiveRecord::Base
  validates :user_id, :server_url, :nickname, presence: false

  has_many :channels
  belongs_to :user

  def channel_list
    self.channels.map(&:channel_name)
  end

end
