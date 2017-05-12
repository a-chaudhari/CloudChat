import {RECEIVED_WELCOME_PACKAGE, RECEIVE_SOCKET,
        CHANGE_ROOM, NEW_SETTINGS, NEW_TOPIC,
        DEL_SERVER, ADD_SERVER, CHANGE_UI} from '../actions/configuration_actions';
import {USER_SELF_JOIN, USER_SELF_PART} from '../actions/channel_actions';
import merge from 'lodash/merge';

const defaultState = {
  settings:{
    timestamps: true,
    closeKB: false
  },
  socket: null,
  servers: {},
  selectedRoom: null,
  channel: null,
  server: null,
  mobile: true
};

const findFirstAvailableChannel = (servers) => {

  var serverKeys = Object.keys(servers);
  if(serverKeys.length > 0){
    var chanKeys = Object.keys(servers[serverKeys[0]].channels);
    if(chanKeys.length > 0){
      var newSelectedRoom=serverKeys[0] + " " + chanKeys[0];
      return {selectedRoom: newSelectedRoom,
              server: serverKeys[0],
              channel: chanKeys[0]};
    }
  }
  return {selectedRoom: null, channel: null, server: null};
};

const ConfigurationReducer = (state=defaultState, action) =>{
  switch(action.type){

    case RECEIVED_WELCOME_PACKAGE:
      var newState = merge({},state,{servers:action.data.servers});
      var newSelectedRoom = null;

      //remove the buffer and chan list.  also set the active chan to first available
      Object.keys(newState.servers).forEach((key)=>{
        let server = newState.servers[key];
        Object.keys(server.channels).forEach((chanKey)=>{
          let channel = server.channels[chanKey];
          if(newSelectedRoom===null){
            newSelectedRoom=key + " " + chanKey;
            newState.channel = chanKey;
            newState.server = key;
          }
          delete channel["buffer"];
          delete channel["users"];
        });
      });
      newState.selectedRoom = newSelectedRoom;
      return newState;

    case NEW_SETTINGS:
      return merge({}, state, {settings: action.settings});

    case ADD_SERVER:
      var newState = merge({},state);
      var obj = {
        server: action.data.server,
        channels: action.data.channels,
        nickname: action.data.nickname
      };
      newState.servers[action.data.server] = obj;
      return newState;

    case DEL_SERVER:
      var newState = merge({}, state);
      delete newState.servers[action.data.server];
      Object.assign(newState, findFirstAvailableChannel(newState.servers));
      return newState;

    case CHANGE_ROOM:
      var chunks = action.room.split(' ');
      var obj = {
        selectedRoom:action.room,
        server: chunks[0],
        channel: chunks[1]
      };
      return merge({}, state, obj);

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
        topic: action.data.topic,
        query: action.data.query
      };
      newState.server = action.data.server;
      newState.channel = action.data.channel;
      newState.selectedRoom = action.data.server + " " + action.data.channel;
      return newState;

    case USER_SELF_PART:
      var newState = merge({},state);
      delete newState.servers[action.data.server].channels[action.data.channel];

      //need to update the currently selected room if we left the currently selected room
      Object.assign(newState, findFirstAvailableChannel(newState.servers));

      return newState;

    case RECEIVE_SOCKET:
      return merge({},state,{socket:action.socket});

    default:
      return state;
  }
};

export default ConfigurationReducer;
