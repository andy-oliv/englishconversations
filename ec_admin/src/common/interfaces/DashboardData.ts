import User from '../../entities/User';

export default interface DashboardData {
  monthlyLogins: { loginDate: string; logins: number }[];
  latestLogins: Partial<User>[];
  userProgresses: Partial<User>[];
  totalStudents: number;
  totalChapters: number;
  totalUnits: number;
  totalVideos: number;
  totalExercises: number;
  notifications: Partial<Notification>[];
}
