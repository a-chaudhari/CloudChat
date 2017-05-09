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
  username: "guest2",
  password: "password"
  })

Server.destroy_all
Channel.destroy_all

case Rails.env
when "development"
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
  s3 = Server.create!({
    user_id: u1.id,
    server_url: "card.freenode.net",
    username: "user",
    nickname: "delos1942"
    })

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

    c4 = Channel.create!({
      server_id: s3.id,
      channel_name: '#test1115'
    })



when "production"
  s1= Server.create!({
    user_id: u1.id,
    server_url: "irc.freenode.net",
    username: "user",
    nickname: "cc_user"
    })

  s1= Server.create!({
    user_id: u1.id,
    server_url: "irc.freenode.net",
    username: "user",
    nickname: "cc_user_2"
    })

  c1 = Channel.create!({
  server_id: s1.id,
  channel_name: '##cc_demo_1'
  })

  c2 = Channel.create!({
    server_id: s1.id,
    channel_name: '##cc_demo_2'
  })

  c3 = Channel.create!({
    server_id: s1.id,
    channel_name: '#freenode'
  })

  c4 = Channel.create!({
    server_id: s1.id,
    channel_name: '#ubuntu'
  })

  c5 = Channel.create!({
  server_id: s2.id,
  channel_name: '##cc_demo_1'
  })

  c6 = Channel.create!({
    server_id: s2.id,
    channel_name: '##cc_demo_2'
  })

end
