import { Socket } from 'socket.io';
import Payload from './Payload';

export default interface AuthSocket extends Socket {
  user?: Payload;
}
