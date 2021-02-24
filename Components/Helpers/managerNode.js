/* eslint-disable prettier/prettier */
import io from 'socket.io-client';
import {_MAIN_URL_ENDPOINT} from '@env';
//...
const socket = io(_MAIN_URL_ENDPOINT, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 100,
  reconnectionDelayMax: 200,
});

export default socket;
