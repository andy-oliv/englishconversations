import type { ReactElement } from "react";
import CorrectOrIncorrect from "../../components/exercises/correctOrIncorrect/CorrectOrIncorrect";
import FillInTheBlanks from "../../components/exercises/fillInTheBlanks/FillInTheBlanks";
import FreeAnswerQuestion from "../../components/exercises/freeAnswerQuestion/FreeAnswerQuestion";
import ListeningComprehension from "../../components/exercises/listeningComprehension/ListeningComprehension";
import MatchTheColumns from "../../components/exercises/matchTheColumns/MatchTheColumns";
import MultipleChoiceQuestion from "../../components/exercises/multipleChoiceQuestion/MultipleChoiceQuestion";
import Pictionary from "../../components/exercises/pictionary/Pictionary";
import SpeakingExercise from "../../components/exercises/speakingExercise/SpeakingExercise";
import Translation from "../../components/exercises/translation/Translation";
import UnscrambleSentence from "../../components/exercises/unscrambleSentence/UnscrambleSentence";
import UnscrambleWord from "../../components/exercises/unscrambleWord/UnscrambleWord";
import VideoQuestion from "../../components/exercises/videoQuestion/VideoQuestion";
import type ExerciseComponentProps from "../../components/exercises/ExerciseComponent.types";

//map that incorporates all exercise components
export const exerciseComponentMap: Record<
  string,
  (exercise: ExerciseComponentProps) => ReactElement
> = {
  CORRECT_OR_INCORRECT: CorrectOrIncorrect,
  FILL_IN_THE_BLANKS: FillInTheBlanks,
  FREE_ANSWER_QUESTION: FreeAnswerQuestion,
  LISTENING_COMPREHENSION: ListeningComprehension,
  MATCH_THE_COLUMNS: MatchTheColumns,
  MULTIPLE_CHOICE_QUESTION: MultipleChoiceQuestion,
  PICTIONARY: Pictionary,
  SPEAKING_EXERCISE: SpeakingExercise,
  TRANSLATION: Translation,
  UNSCRAMBLE_SENTENCE: UnscrambleSentence,
  UNSCRAMBLE_WORD: UnscrambleWord,
  VIDEO_QUESTION: VideoQuestion,
};
