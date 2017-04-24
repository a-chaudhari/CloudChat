import {RECEIVED_WELCOME_PACKAGE, RECEIVE_SOCKET, CHANGE_ROOM} from '../actions/configuration_actions';
import {USER_SELF_JOIN} from '../actions/channel_actions';
import merge from 'lodash/merge';

const ConfigurationReducer = (state={socket:null, servers:{}, selectedRoom:null}, action) =>{
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

    case CHANGE_ROOM:
      return merge({},state,{selectedRoom:action.room});

    case USER_SELF_JOIN:
      var newState = merge({},state);
      var server = newState.servers[action.data.server];
      server.channels[action.data.channel]={
        name: action.data.channel,
        topic: action.data.topic
      }
      newState.selectedRoom = action.data.server + " " + action.data.channel;
      return newState;

    case RECEIVE_SOCKET:
      return merge({},state,{socket:action.socket});

    default:
      return state;
  }
};

export default ConfigurationReducer;
