# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170411193113) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "channels", force: :cascade do |t|
    t.integer  "server_id",                   null: false
    t.string   "channel_name",                null: false
    t.string   "channel_pass", default: ""
    t.boolean  "enabled",      default: true
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "channels", ["server_id"], name: "index_channels_on_server_id", using: :btree

  create_table "servers", force: :cascade do |t|
    t.integer "user_id",                                null: false
    t.string  "server_url",                             null: false
    t.string  "server_pass", default: ""
    t.integer "port",        default: 6667
    t.string  "username"
    t.string  "realname",    default: "CloudChat User"
    t.string  "nickname",                               null: false
  end

  add_index "servers", ["user_id"], name: "index_servers_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "session_token"
    t.string "password_digest"
  end

  add_index "users", ["session_token"], name: "index_users_on_session_token", using: :btree
  add_index "users", ["username"], name: "index_users_on_username", using: :btree

end
