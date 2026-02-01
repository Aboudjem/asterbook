import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTransactionDto {
  @ApiProperty({
    example: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    description: 'The transaction hash to verify',
  })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{64}$/, {
    message: 'Invalid transaction hash format',
  })
  txHash: string;
}
