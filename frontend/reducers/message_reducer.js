import {NEW_CHANNEL_MSG, NEW_CHANNEL_MSG_LOCAL, USER_JOIN,
        USER_PART, USER_SELF_JOIN, USER_SELF_PART} from '../actions/channel_actions';
import {RECEIVED_WELCOME_PACKAGE, DEL_SERVER} from '../actions/configuration_actions';
import merge from 'lodash/merge';
window.merge = merge;

const MessageReducer = (state={messages:{},users:{}},action) => {
  switch (action.type) {
    case NEW_CHANNEL_MSG:
      var newState = merge({},state);
      newState.messages[`${action.msg.server} ${action.msg.channel}`].push(action.msg);
      // return merge({},{messages: state.messages.concat([action.msg.data])});
      return newState;

    case NEW_CHANNEL_MSG_LOCAL:
      var newState = merge({},state);
      // debugger
      newState.messages[action.msg.target].push(action.msg);
      // return merge({},{messages: state.messages.concat([action.msg.data])});
      return newState;

    case DEL_SERVER:
      var newState = merge({}, state);
      Object.keys(newState.messages).forEach(key=>{
        if(key.startsWith(action.data.server)){
          delete newState.messages[key];
          delete newState.users[key];
        }
      });
      return newState;

    case USER_SELF_JOIN:
      var newState = merge({},state);
      var str = action.data.server + " " + action.data.channel;
      newState.messages[str] = action.data.buffer;
      newState.users[str] = action.data.users;
      return newState;

    case USER_SELF_PART:
      var newState = merge({},state);
      var str = action.data.server + " " + action.data.channel;
      delete newState.messages[str];
      delete newState.users[str];
      return newState;

    case USER_PART:
      var new_state = merge({},state);
      var chan_string = action.data.server + " " + action.data.channel;
      // debugger
      var users = new_state.users[chan_string];
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
      var users = {};
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
};

export default MessageReducer;
