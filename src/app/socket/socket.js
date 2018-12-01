import openSocket from 'socket.io-client';

const socketURL = () => {
  const port = 3001;

  return `:${port}`;
};

export const socket = openSocket(socketURL());
