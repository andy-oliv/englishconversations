export function generateRandomLevel(): any {
  const levels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  const selectedLevel: any = levels[Math.floor(Math.random() * levels.length)];
  return selectedLevel;
}

export function generateRandomDifficulty(): any {
  const difficulties: string[] = ['EASY', 'MEDIUM', 'HARD'];

  const selectedDifficulty: any =
    difficulties[Math.floor(Math.random() * difficulties.length)];
  return selectedDifficulty;
}
