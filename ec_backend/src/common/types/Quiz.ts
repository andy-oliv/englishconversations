export default interface Quiz {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  level: string;
  exercises: number[];
}
