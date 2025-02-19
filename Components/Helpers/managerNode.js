/* eslint-disable prettier/prettier */
import io from 'socket.io-client';
import {_MAIN_URL_ENDPOINT} from '@env';
//...
const socket = io('http://localhost:9999', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 100,
  reconnectionDelayMax: 200,
});

export default socket;
