import { Type } from 'class-transformer';
import CreateBatchExercisesDTO from './createBatchExercises.dto';
import { ValidateNested } from 'class-validator';

export class CreateBatchExercisesArrayDTO {
  @Type(() => CreateBatchExercisesDTO)
  @ValidateNested({ each: true })
  exercises: CreateBatchExercisesDTO[];
}
