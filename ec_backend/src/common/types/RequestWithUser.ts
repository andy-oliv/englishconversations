import { Request } from 'express';
import Payload from './Payload';

export default interface RequestWithUser extends Request {
  user: Payload;
}
