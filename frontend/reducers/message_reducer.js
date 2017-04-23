import {NEW_CHANNEL_MSG, NEW_CHANNEL_MSG_LOCAL, USER_JOIN, USER_PART} from '../actions/channel_actions';
import {RECEIVED_WELCOME_PACKAGE} from '../actions/configuration_actions';

import merge from 'lodash/merge';
window.merge = merge;

const MessageReducer = (state={messages:{},users:{}},action) => {
  switch (action.type) {
    case NEW_CHANNEL_MSG:
      let newState = merge({},state);
      // debugger
      newState.messages[`${action.msg.server} ${action.msg.channel}`].push(action.msg)
      // return merge({},{messages: state.messages.concat([action.msg.data])});
      return newState;

    case NEW_CHANNEL_MSG_LOCAL:
      let newState2 = merge({},state);
      // debugger
      newState2.messages[action.msg.target].push(action.msg)
      // return merge({},{messages: state.messages.concat([action.msg.data])});
      return newState2;

    case USER_PART:
      var new_state = merge({},state);
      var chan_string = action.data.server + " " + action.data.channel;
      // debugger
      var users = new_state.users[chan_string]
      for(var i = 0;i< users.length;i++){
        if(users[i]===action.data.user){
          users.splice(i,1);
          break;
        }
      }

      new_state.users[chan_string]=users;

      return new_state;

    case USER_JOIN:
      var new_state = merge({},state);
      var chan_string = action.data.server + " " + action.data.channel;
      new_state.users[chan_string].push(action.data.user);
      return new_state;

    case RECEIVED_WELCOME_PACKAGE:
      let messages = {};
      let users = {};
      Object.keys(action.data.servers).forEach(server_key=>{
        const server = action.data.servers[server_key];
        Object.keys(server.channels).forEach(chan_key=>{
          const channel = server.channels[chan_key];
          messages[`${server_key} ${chan_key}`]=channel.buffer;
          users[`${server_key} ${chan_key}`]=channel.users;
        });
      });
      console.log({messages,users});
      return {messages,users};
    default:
      return state;
  }
}

export default MessageReducer;
