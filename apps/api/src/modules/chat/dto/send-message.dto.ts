import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'Hello!', description: 'Message content' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message: string;
}
