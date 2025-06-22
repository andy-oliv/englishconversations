import { UserRoles } from '../../../generated/prisma';

export default interface Payload {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
}
