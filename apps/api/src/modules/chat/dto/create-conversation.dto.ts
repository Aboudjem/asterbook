import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 1, description: 'Target user ID to start conversation with' })
  @IsInt()
  @IsPositive()
  targetUserId: number;
}
