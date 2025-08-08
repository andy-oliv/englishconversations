import { PrismaClient, Status } from '@prisma/client';
import User from '../../src/entities/User';
import Chapter from '../../src/entities/Chapter';

const prisma = new PrismaClient();

export default async function userChapterSeed(): Promise<void> {
  const users: Partial<User>[] = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  const chapters: Partial<Chapter>[] = await prisma.chapter.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const progresses = users.flatMap((user) => {
    return chapters.map((chapter) =>
      chapter.name === 'A1'
        ? { userId: user.id, chapterId: chapter.id, status: Status.IN_PROGRESS }
        : { userId: user.id, chapterId: chapter.id },
    );
  });

  await prisma.userChapter.createMany({
    data: progresses,
  });
}
