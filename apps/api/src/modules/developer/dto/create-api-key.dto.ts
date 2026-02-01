import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'My API Key', description: 'Name for the API key (3-50 chars)' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
