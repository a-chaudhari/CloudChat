import { combineReducers } from 'redux';
import MessageReducer from './message_reducer';

const rootReducer= combineReducers({
  messages: MessageReducer
});

export default rootReducer;
