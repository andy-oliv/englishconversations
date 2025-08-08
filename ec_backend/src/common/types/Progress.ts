import ChapterProgress from '../../entities/ChapterProgress';
import UnitProgress from '../../entities/UnitProgress';
import CurrentChapter from './CurrentChapter';

export default interface Progress {
  currentChapter: CurrentChapter;
  totalChapters: number;
  totalUnits: number;
  totalTests: number;
  totalCompletedChapters: number;
  totalCompletedUnits: number;
  totalCompletedTests: number;
  chapterProgress: ChapterProgress[];
  unitProgress: UnitProgress[];
}
