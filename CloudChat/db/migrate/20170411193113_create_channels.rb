class CreateChannels < ActiveRecord::Migration
  def change
    create_table :channels do |t|
      t.integer :server_id, null: false
      t.string :channel_name, null:false
      t.string :channel_pass, default: ""
      t.boolean :enabled, default: true
      t.timestamps
    end
    add_index :channels, :server_id
  end
end
