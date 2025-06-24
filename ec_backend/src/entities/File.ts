import { FileTypes } from '../../generated/prisma';

export default interface File {
  id?: string;
  name: string;
  type: FileTypes;
  url: string;
  size: number;
}
