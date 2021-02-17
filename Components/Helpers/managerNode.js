/* eslint-disable prettier/prettier */
import io from 'socket.io-client';

const nodeURL = 'http://192.168.8.145:9097/';
//...
const socket = io(nodeURL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 100,
  reconnectionDelayMax: 200,
});

export default socket;
