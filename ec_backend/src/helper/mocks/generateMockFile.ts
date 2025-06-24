import { faker } from '@faker-js/faker/.';
import File from '../../entities/File';
import { FileTypes } from '../../../generated/prisma';

const fileTypes: FileTypes[] = ['PDF', 'AUDIO', 'IMAGE'];

export default function generateMockFile(): File {
  const file: File = {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    type: getRandomFileType(),
    url: faker.internet.url(),
    size: faker.number.int(),
  };

  return file;
}

function getRandomFileType(): FileTypes {
  const randomType: FileTypes =
    fileTypes[Math.floor(Math.random() * fileTypes.length)];

  return randomType;
}
