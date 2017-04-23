import * as SessionAPIUtil from '../utils/session_utils';

export const RECEIVE_SESSION = "RECEIVE_SESSION";
export const CLEAR_SESSION = "CLEAR_SESSION";
export const ERROR_SESSION = "ERROR_SESSION";

export const receiveSession = (session) => ({
  type: RECEIVE_SESSION,
  session
});

export const clearSession = () =>({
  type: CLEAR_SESSION
});

export const errorSession = (err) =>({
  type: ERROR_SESSION,
  error: err
});

export const logIn = (info) => dispatch => (
  SessionAPIUtil.logIn(info).then(
    ret=>dispatch(receiveSession(ret)),
    err=>dispatch(errorSession(err))
  )
);

export const logOut = () => dispatch => (
  SessionAPIUtil.logOut().then(
    ret=>dispatch(clearSession())
  )
);

export const signUp = (info) => dispatch => (
  SessionAPIUtil.signUp(info).then(
    ret=>dispatch(receiveSession(ret)),
    err=>dispatch(errorSession(err))
  )
);
