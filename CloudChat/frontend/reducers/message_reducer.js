import {NEW_CHANNEL_MSG} from '../actions/channel_actions';
import merge from 'lodash/merge';
window.merge = merge;

const MessageReducer = (state={messages:[]},action) => {
  switch (action.type) {
    case NEW_CHANNEL_MSG:
      // debugger
      return merge({},{messages: state.messages.concat([action.msg.data])});
    default:
      return state
  }
}

export default MessageReducer;
