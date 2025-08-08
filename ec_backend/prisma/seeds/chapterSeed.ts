import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function chapterSeed(): Promise<void> {
  await prisma.chapter.createMany({
    data: [
      {
        name: 'A1',
        description:
          "This track is your first step in the English Conversations journey. Here, you'll learn essential vocabulary to introduce yourself, talk about your routine, express likes and needs, and understand the basics of English in everyday situations. More than memorizing words, you'll be encouraged to use the language as a tool for self-expression from day one, helping you build a strong and confident foundation for communication.",
        imageUrl:
          'https://englishconversations-files.s3.us-east-1.amazonaws.com/images/a1_card.png',
      },
      {
        name: 'A2',
        description:
          "Now that you've got the basics, it's time to expand. Track A2 deepens your ability to talk about the world around you — past experiences, future plans, and simple opinions. You'll begin to see English as a bridge between you and others, and the content becomes more connected to your reality, encouraging genuine exchanges.",
        imageUrl:
          'https://englishconversations-files.s3.us-east-1.amazonaws.com/images/a2_card.png',
      },
      {
        name: 'B1',
        description:
          "At the B1 level, you already have functional English — now it's time to talk about what really matters to you. This track focuses on deeper, more personal discussions, helping you sustain conversations, build arguments, and reflect in English. With themes like purpose, art, spirituality, and modern dilemmas, this stage invites you to use English as a tool for self-discovery.",
        imageUrl:
          'https://englishconversations-files.s3.us-east-1.amazonaws.com/images/b1_card.png',
      },
      {
        name: 'B2',
        description:
          "You're now able to communicate naturally — this stage focuses on clarity, fluency, and the impact of your speech. B2 is the level where English truly starts to feel like a second language: you'll expand your vocabulary, navigate nuances, and join debates with confidence. Activities here challenge you to refine your English and express your authentic voice.",
        imageUrl:
          'https://englishconversations-files.s3.us-east-1.amazonaws.com/images/b2_card.png',
      },
      {
        name: 'C1',
        description:
          'Reaching C1 means you can think, create, and reflect in English. This track represents an advanced command of the language, focusing on subtlety, tone, style, and depth of thought. The topics at this level invite you to explore intellectually, emotionally, and artistically, using English not just for communication — but for transformation.',
        imageUrl:
          'https://englishconversations-files.s3.us-east-1.amazonaws.com/images/c1_card.png',
      },
    ],
    skipDuplicates: true,
  });
}
