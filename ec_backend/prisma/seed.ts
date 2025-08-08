import { PrismaClient } from '@prisma/client';
import chapterSeed from './seeds/chapterSeed';
import userChapterSeed from './seeds/userChapterSeed';

const prisma = new PrismaClient();

async function seed() {
  await chapterSeed();
  await userChapterSeed();
}

async function main() {
  let success = false;

  try {
    await seed();
    success = true;
  } catch (error) {
    console.error('An error occurred while seeding the database: ', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();

    if (success) {
      console.log('Database seeded!');
    } else {
      console.log('Database not seeded. Check the error above.');
    }
  }
}

main();
