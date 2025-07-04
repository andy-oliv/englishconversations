import { CEFRLevels, UserRoles } from '../../generated/prisma';

export default interface User {
  id?: string;
  name: string;
  bio?: string;
  birthdate: Date;
  city?: string;
  state?: string;
  country?: string;
  avatarUrl?: string;
  languageLevel?: CEFRLevels;
  email: string;
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  emailTokenExpires?: Date;
  password: string;
  refreshToken?: string;
  passwordResetToken?: string;
  resetPasswordExpires?: Date;
  role?: UserRoles;
  lastLogin?: Date;
}
