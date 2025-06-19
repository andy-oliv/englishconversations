import { CEFRLevels, UserRoles } from '../../../generated/prisma';

export default interface User {
  id?: string;
  name: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  avatarUrl?: string;
  languageLevel?: CEFRLevels;
  email: string;
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  password: string;
  refreshToken?: string;
  passwordResetToken?: string;
  resetPasswordExpires?: Date;
  role?: UserRoles;
  lastLogin?: Date;
}
