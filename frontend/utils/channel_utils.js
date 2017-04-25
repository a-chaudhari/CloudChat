export const leaveRoom(socket, server, channel){
  const command = {
    command: "part",
    server,
    channel
  };
  socket.send(JSON.stringify(command));

}
