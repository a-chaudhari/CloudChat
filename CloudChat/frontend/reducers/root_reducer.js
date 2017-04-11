import { combineReducers } from 'redux';
import MessageReducer from './message_reducer';
import SessionReducer from './session_reducer';

const rootReducer= combineReducers({
  messages: MessageReducer,
  session: SessionReducer
});

export default rootReducer;
