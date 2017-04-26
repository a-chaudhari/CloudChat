export const RECEIVED_WELCOME_PACKAGE = "RECEIVED_WELCOME_PACKAGE";
export const RECEIVE_SOCKET = "RECEIVE_SOCKET";
export const CHANGE_ROOM = 'CHANGE_ROOM';
export const CHANGE_UI = 'CHANGE_UI';

export const changeUI = (mobile) =>({
  type: CHANGE_UI,
  mobile
});

export const changeRoom = (room) =>({
  type: CHANGE_ROOM,
  room
});

export const receiveWelcomePackage = (data)=>({
  type: RECEIVED_WELCOME_PACKAGE,
  data
});

export const receiveSocket = (socket) =>({
  type: RECEIVE_SOCKET,
  socket
});
