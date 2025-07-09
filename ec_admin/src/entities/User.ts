export default interface User {
  id: string;
  name: string;
  bio?: string;
  birthdate?: Date;
  city?: string;
  state?: string;
  country?: string;
  avatarUrl: string;
  languageLevel: string;
  email: string;
  role: string;
  lastLogin?: Date;
  chapters?: { status: string }[];
}
