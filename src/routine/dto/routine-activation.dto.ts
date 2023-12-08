import { ApiProperty } from '@nestjs/swagger';

export class ToggleActivation {
  @ApiProperty({ description: '루틴 활성여부', example: true })
  isActived: boolean;
}
