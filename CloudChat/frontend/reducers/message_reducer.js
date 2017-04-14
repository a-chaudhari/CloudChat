import {NEW_CHANNEL_MSG} from '../actions/channel_actions';
import {RECEIVED_WELCOME_PACKAGE} from '../actions/configuration_actions';

import merge from 'lodash/merge';
window.merge = merge;

const MessageReducer = (state={messages:{},users:{}},action) => {
  switch (action.type) {
    case NEW_CHANNEL_MSG:
      let newState = merge({},state);
      newState.messages[`${action.msg.server} ${action.msg.channel}`].push(action.msg)
      // return merge({},{messages: state.messages.concat([action.msg.data])});
      return newState;

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
