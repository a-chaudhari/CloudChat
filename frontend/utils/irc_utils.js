export const newServer = (socket, opts) =>{
  socket.send(JSON.stringify(opts));
};
