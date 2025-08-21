export default interface UnitCardProps {
  title: string;
  description: string;
  totalContents: number;
  imgUrl: string;
  isActive: boolean;
  handleClick: (name: string) => void;
}
