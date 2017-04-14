export const NEW_CHANNEL_MSG = "NEW_CHANNEL_MSG";
export const NEW_CHANNEL_MSG_LOCAL = "NEW_CHANNEL_MSG_LOCAL";

export const newChannelMsg = (msg) => ({
  type: NEW_CHANNEL_MSG,
  msg
});

export const newChannelMsgLocal = (msg) => ({
  type: NEW_CHANNEL_MSG_LOCAL,
  msg
});
