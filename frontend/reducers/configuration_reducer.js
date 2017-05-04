import {RECEIVED_WELCOME_PACKAGE, RECEIVE_SOCKET, CHANGE_ROOM, CHANGE_UI, NEW_TOPIC, ADD_SERVER} from '../actions/configuration_actions';
import {USER_SELF_JOIN, USER_SELF_PART} from '../actions/channel_actions';
import merge from 'lodash/merge';

const ConfigurationReducer = (state={socket:null, servers:{}, selectedRoom:null, mobile: true}, action) =>{
  switch(action.type){

    case RECEIVED_WELCOME_PACKAGE:
      var newState = merge({},state,{servers:action.data.servers})
      var newSelectedRoom = null;

      //remove the buffer and chan list.  also set the active chan to first available
      Object.keys(newState.servers).forEach((key)=>{
        let server = newState.servers[key]
        Object.keys(server.channels).forEach((chan_key)=>{
          let channel = server.channels[chan_key]
          if(newSelectedRoom===null){
            newSelectedRoom=key + " " + chan_key;
          }
          delete channel["buffer"]
          delete channel["users"]
        });
      });
      newState.selectedRoom = newSelectedRoom;
      return newState;

    case ADD_SERVER:
      var newState = merge({},state);
      var obj = {
        server: action.data.server,
        channels: action.data.channels,
        nickname: action.data.nickname
      };
      newState.servers[action.data.server] = obj;
      return newState;

    case CHANGE_ROOM:
      return merge({},state,{selectedRoom:action.room});

    case CHANGE_UI:
      return merge({},state,{mobile: action.mobile});

    case NEW_TOPIC:
      var newState = merge({},state);
      newState.servers[action.data.server].channels[action.data.channel].topic = action.data.topic;

      return newState;

    case USER_SELF_JOIN:
      var newState = merge({},state);
      var server = newState.servers[action.data.server];
      server.channels[action.data.channel]={
        name: action.data.channel,
        topic: action.data.topic
      }
      newState.selectedRoom = action.data.server + " " + action.data.channel;
      return newState;

    case USER_SELF_PART:
      var newState = merge({},state);
      delete newState.servers[action.data.server].channels[action.data.channel];

      //need to update the currently selected room if we left the currently selected room
      var newSelectedRoom = null;
      var server_keys = Object.keys(newState.servers);
      if(server_keys.length > 0){
        var chan_keys = Object.keys(newState.servers[server_keys[0]].channels)
        if(chan_keys.length > 0){
          newSelectedRoom=server_keys[0] + " " + chan_keys[0];
          console.log("setting to : " + newSelectedRoom)
        }
      }
      newState.selectedRoom = newSelectedRoom;

      return newState;

    case RECEIVE_SOCKET:
      return merge({},state,{socket:action.socket});

    default:
      return state;
  }
};

export default ConfigurationReducer;
