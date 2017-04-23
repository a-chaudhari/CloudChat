class CreateServers < ActiveRecord::Migration
  def change
    create_table :servers do |t|
      t.integer :user_id, null: false
      t.string :server_url, null: false
      t.string :server_pass, default: ""
      t.integer :port, default: 6667
      t.string :username
      t.string :realname, default: "CloudChat User"
      t.string :nickname, null: false
    end
    add_index :servers, :user_id
  end
end
