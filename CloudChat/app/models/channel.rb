class Channel < ActiveRecord::Base
  validates :server_id, :channel_name, presence: true

  belongs_to :server


end
