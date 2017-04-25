# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.destroy_all

u1= User.create!({
  username: "guest",
  password: "password"
  })
u2 = User.create!({
  username: "test",
  password: "password"
  })

Server.destroy_all

s1= Server.create!({
  user_id: u1.id,
  server_url: "irc.freenode.net",
  username: "user",
  nickname: "delos1843"
  })

s2 = Server.create!({
  user_id: u2.id,
  server_url: "irc.freenode.net",
  username: "user",
  nickname: "rocky89412"
  })

Channel.destroy_all

c1 = Channel.create!({
  server_id: s1.id,
  channel_name: '#test1115'
  })

c2 = Channel.create!({
  server_id: s2.id,
  channel_name: '#test11152'
})

c3 = Channel.create!({
  server_id: s1.id,
  channel_name: '#test11152'
  })
