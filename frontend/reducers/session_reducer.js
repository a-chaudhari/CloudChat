import merge from 'lodash/merge';
import {CLEAR_SESSION, RECEIVE_SESSION,
        ERROR_SESSION} from '../actions/session_actions';


const SessionReducer = (state={errors:[], session:null},action) => {
  switch (action.type) {
    case RECEIVE_SESSION:
      return {errors:[], session:action.session};
    case CLEAR_SESSION:
      return {errors:[], session:null};
    case ERROR_SESSION:
      return {errors:[action.errors], session: null};
    default:
      return state;
  }
};

export default SessionReducer;
