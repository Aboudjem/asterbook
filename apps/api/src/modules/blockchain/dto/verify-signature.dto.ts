import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifySignatureDto {
  @ApiProperty({
    example: 'Sign this message to verify wallet ownership: 1234567890',
    description: 'The message that was signed',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: '0x1234...abcd',
    description: 'The signature produced by the wallet',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    example: '0x742d35Cc6634C0532925a3b844Bc9e7595f3Bbd3',
    description: 'The wallet address that supposedly signed the message',
  })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Invalid Ethereum/BSC address format',
  })
  address: string;
}
