export const NEW_CHANNEL_MSG = "NEW_CHANNEL_MSG";
export const NEW_CHANNEL_MSG_LOCAL = "NEW_CHANNEL_MSG_LOCAL";
export const USER_JOIN = 'USER_JOIN';
export const USER_PART = 'USER_PART';
export const USER_SELF_JOIN = 'USER_SELF_JOIN';

export const userSelfJoin = (data)=>({
  type: USER_SELF_JOIN,
  data
});

export const userJoin = (data)=>({
  type: USER_JOIN,
  data
});

export const userPart = (data) =>({
  type: USER_PART,
  data
});

export const newChannelMsg = (msg) => ({
  type: NEW_CHANNEL_MSG,
  msg
});

export const newChannelMsgLocal = (msg) => ({
  type: NEW_CHANNEL_MSG_LOCAL,
  msg
});
