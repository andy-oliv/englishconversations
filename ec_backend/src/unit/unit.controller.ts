import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';

@ApiTags('Units')
@Controller('api/units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}
}
