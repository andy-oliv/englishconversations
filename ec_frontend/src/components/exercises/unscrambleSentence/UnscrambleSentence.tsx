import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/UnscrambleSentence.module.scss";
import type ExerciseComponentProps from "../ExerciseComponent.types";
import { useActiveQuizStore } from "../../../stores/activeQuizStore";
import { useQuizAnswerStore } from "../../../stores/quizAnswerStore";
import QuestionNumber from "../../questionNumber/QuestionNumber";
import UnscrambleOption from "../../unscrambleOption/UnscrambleOption";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import DraggableOption from "../../draggableOption/DraggableOption";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableDraggableOption from "../../sortableDraggableOption/SortableDraggableOption";

export default function UnscrambleSentence({
  exercise,
}: ExerciseComponentProps): ReactElement {
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;

    if (over) {
      const oldIndex = droppedElements.indexOf(active.id.toString());
      const newIndex = droppedElements.indexOf(over.id.toString());

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(droppedElements, oldIndex, newIndex);
        setDroppedElements(reordered);
        setAnswer(
          exercise.id,
          [reordered.toString().replaceAll(",", " ")],
          true,
          0
        );
        return;
      }
    }

    if (active?.id) {
      const option = active.id.toString();
      setInvisibleElements([...invisibleElements, active.id.toString()]);
      if (!droppedElements.includes(option)) {
        const splitOption: string = option.split("-")[2];
        const updatedOptions = [...droppedElements, splitOption];
        setDroppedElements(updatedOptions);
        setAnswer(
          exercise.id,
          [updatedOptions.toString().replaceAll(",", " ")],
          true,
          0
        );
      }
    }
  }

  const { currentExerciseIndex } = useActiveQuizStore();
  const [droppedElements, setDroppedElements] = useState<string[]>([]);
  const [invisibleElements, setInvisibleElements] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const { setAnswer } = useQuizAnswerStore();
  const getAnswer = useQuizAnswerStore((state) => state.getAnswer);
  const { setNodeRef } = useDroppable({ id: "droppable" });

  useEffect(() => {
    if (
      getAnswer(exercise.id).isAnswered &&
      getAnswer(exercise.id).answer[0].split(" ").length ===
        exercise.options?.length
    ) {
      const answer: string[] = getAnswer(exercise.id).answer[0].split(" ");
      setDroppedElements(answer);
      setIsAnswered(true);
    }
  }, [getAnswer, exercise]);

  return (
    <>
      <QuestionNumber number={currentExerciseIndex + 1} />
      <h1 className={styles.title}>Unscramble the sentence</h1>
      <p className={styles.description}>{exercise.description}</p>
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        sensors={useSensors(useSensor(PointerSensor))}
      >
        <SortableContext
          items={droppedElements}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.dropArea} ref={setNodeRef}>
            {droppedElements.map((option, index) => (
              <SortableDraggableOption
                key={index}
                id={`${option}`}
                label={option}
              ></SortableDraggableOption>
            ))}
          </div>
        </SortableContext>
        <div className={styles.options}>
          {exercise.options?.map((option, index) => (
            <DraggableOption
              key={`${exercise.id}-${index}-${option}`}
              id={`${exercise.id}-${index}-${option}`}
              isVisible={
                invisibleElements.includes(
                  `${exercise.id}-${index}-${option}`
                ) || isAnswered
                  ? false
                  : true
              }
            >
              <UnscrambleOption label={option} />
            </DraggableOption>
          ))}
        </div>
      </DndContext>
    </>
  );
}
