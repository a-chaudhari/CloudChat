import {RECEIVED_WELCOME_PACKAGE, RECEIVE_SOCKET} from '../actions/configuration_actions';
import merge from 'lodash/merge';

const ConfigurationReducer = (state={socket:null, servers:{}}, action) =>{
  switch(action.type){
    case RECEIVED_WELCOME_PACKAGE:
      let newState = merge({},state,{servers:action.data.servers})
      // debugger
      Object.keys(newState.servers).forEach((key)=>{
        let server = newState.servers[key]
        Object.keys(server.channels).forEach((chan_key)=>{
          let channel = server.channels[chan_key]
          delete channel["buffer"]
          delete channel["users"]
        });
      });
      return newState;
    case RECEIVE_SOCKET:
      return merge({},state,{socket:action.socket});
    default:
      return state;
  }
};

export default ConfigurationReducer;
