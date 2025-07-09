import User from '../../entities/User';

export default interface DashboardData {
  users: User[];
  students: number;
  chapters: number;
  units: number;
  videos: number;
  exercises: number;
}
