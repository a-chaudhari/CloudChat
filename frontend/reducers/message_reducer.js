import {NEW_CHANNEL_MSG, NEW_CHANNEL_MSG_LOCAL, USER_SELF_PART,
        USER_PART, USER_SELF_JOIN, USER_JOIN} from '../actions/channel_actions';
import {RECEIVED_WELCOME_PACKAGE,
        DEL_SERVER} from '../actions/configuration_actions';
import merge from 'lodash/merge';

const MessageReducer = (state={messages:{},users:{}, counters:{}},action) => {
  switch (action.type) {
    case NEW_CHANNEL_MSG:
      var newState = merge({},state);
      newState.messages[`${action.msg.server} ${action.msg.channel}`].push(action.msg);
      return newState;

    case NEW_CHANNEL_MSG_LOCAL:
      var newState = merge({},state);
      newState.messages[action.msg.target].push(action.msg);
      return newState;

    case DEL_SERVER:
      var newState = merge({}, state);
      Object.keys(newState.messages).forEach(key=>{
        if(key.startsWith(action.data.server)){
          delete newState.messages[key];
          delete newState.users[key];
          delete newState.counters[key];
        }
      });
      return newState;

    case USER_SELF_JOIN:
      var newState = merge({},state);
      var str = action.data.server + " " + action.data.channel;
      newState.messages[str] = action.data.buffer;
      newState.users[str] = action.data.users;
      newState.counters[str] = 0;
      return newState;

    case USER_SELF_PART:
      var newState = merge({},state);
      var str = action.data.server + " " + action.data.channel;
      delete newState.messages[str];
      delete newState.users[str];
      delete newState.counters[str];
      return newState;

    case USER_PART:
      var newState = merge({},state);
      var chanString = action.data.server + " " + action.data.channel;
      var users = newState.users[chanString];
      for(var i = 0;i< users.length;i++){
        if(users[i]===action.data.user){
          users.splice(i,1);
          break;
        }
      }
      newState.users[chanString]=users;
      return newState;

    case USER_JOIN:
      var chanString = action.data.server + " " + action.data.channel;
      // debugger
      var newState = merge({},state);
      Object.assign(newState.users[chanString], {[action.data.user]:''});
      return newState;

    case RECEIVED_WELCOME_PACKAGE:
      let messages = {};
      var users = {};
      var counters = {};
      Object.keys(action.data.servers).forEach(serverKey=>{
        const server = action.data.servers[serverKey];
        Object.keys(server.channels).forEach(chanKey=>{
          const channel = server.channels[chanKey];
          const chanStr = serverKey + " " + chanKey;
          messages[chanStr]=channel.buffer;
          users[chanStr]=channel.users;
          counters[chanStr]=0;
        });
      });
      return {messages,users,counters};

    default:
      return state;
  }
};

export default MessageReducer;
