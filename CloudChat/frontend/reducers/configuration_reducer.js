import {RECEIVED_WELCOME_PACKAGE} from '../actions/configuration_actions';
import merge from 'lodash/merge';

const ConfigurationReducer = (state={servers:{}}, action) =>{
  switch(action.type){
    case RECEIVED_WELCOME_PACKAGE:
      let newState = merge({},{servers:action.data.servers})
      // debugger
      Object.keys(newState.servers).forEach((key)=>{
        let server = newState.servers[key]
        Object.keys(server.channels).forEach((chan_key)=>{
          let channel = server.channels[chan_key]
          delete channel["buffer"]
          delete channel["users"]
        });
      });
      // debugger
      return newState;
    default:
      return state;
  }
}

export default ConfigurationReducer;
