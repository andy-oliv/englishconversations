export default interface UnitCardProps {
  title: string;
  description: string;
  totalContents: number;
  imgUrl: string;
  isActive: boolean;
  isLocked: boolean;
  isCompleted: boolean;
  currentProgress: number;
  handleClick: (name: string) => void;
}
