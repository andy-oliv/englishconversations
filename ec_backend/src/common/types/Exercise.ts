export default interface Exercise {
  id?: number;
  type: string;
  description: string;
  level: string;
  answers?: string[] | number[]; //optional field because the 'match the columns' exercises don't have predefined answers
  correctAnswer: string | number[];
}
