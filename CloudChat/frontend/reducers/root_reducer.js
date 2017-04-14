import { combineReducers } from 'redux';
import MessageReducer from './message_reducer';
import SessionReducer from './session_reducer';
import ConfigurationReducer from './configuration_reducer';

const rootReducer= combineReducers({
  messages: MessageReducer,
  session: SessionReducer,
  config: ConfigurationReducer
});

export default rootReducer;
