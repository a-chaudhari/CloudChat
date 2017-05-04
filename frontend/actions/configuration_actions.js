export const RECEIVED_WELCOME_PACKAGE = "RECEIVED_WELCOME_PACKAGE";
export const RECEIVE_SOCKET = "RECEIVE_SOCKET";
export const CHANGE_ROOM = 'CHANGE_ROOM';
export const CHANGE_UI = 'CHANGE_UI';
export const NEW_TOPIC = 'NEW_TOPIC';
export const ADD_SERVER = 'ADD_SERVER';
export const DEL_SERVER = 'DEL_SERVER';

export const delServer = (data) =>({
  type: DEL_SERVER,
  data
});

export const addServer = (data) =>({
  type: ADD_SERVER,
  data
});

export const newTopic = (data) =>({
  type: NEW_TOPIC,
  data
});

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
