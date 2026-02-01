import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('verify-signature')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify wallet ownership via signature' })
  @ApiResponse({
    status: 200,
    description: 'Signature verification result',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        address: { type: 'string' },
      },
    },
  })
  async verifySignature(@Body() dto: VerifySignatureDto) {
    const isValid = await this.blockchainService.verifySignature(
      dto.message,
      dto.signature,
      dto.address,
    );

    return {
      isValid,
      address: dto.address,
    };
  }

  @Get('balance/:address')
  @ApiOperation({ summary: 'Get wallet balance (BNB and ASTER token)' })
  @ApiParam({
    name: 'address',
    description: 'Wallet address to check balance',
    example: '0x742d35Cc6634C0532925a3b844Bc9e7595f3Bbd3',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet balance information',
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        bnbBalance: { type: 'string' },
        tokenBalance: { type: 'string' },
        tokenSymbol: { type: 'string' },
      },
    },
  })
  async getBalance(@Param('address') address: string) {
    return this.blockchainService.getWalletBalance(address);
  }

  @Post('verify-transaction')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify a BSC transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction verification result',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        from: { type: 'string' },
        to: { type: 'string' },
        value: { type: 'string' },
        blockNumber: { type: 'number' },
        confirmations: { type: 'number' },
        timestamp: { type: 'number' },
      },
    },
  })
  async verifyTransaction(@Body() dto: VerifyTransactionDto) {
    return this.blockchainService.verifyTransaction(dto.txHash);
  }

  @Get('prices')
  @ApiOperation({ summary: 'Get current crypto prices (ASTER, BNB)' })
  @ApiResponse({
    status: 200,
    description: 'Current cryptocurrency prices',
    schema: {
      type: 'object',
      properties: {
        aster: { type: 'number', example: 0.05 },
        bnb: { type: 'number', example: 580 },
        lastUpdated: { type: 'string', format: 'date-time' },
      },
    },
  })
  async getPrices() {
    return this.blockchainService.getCryptoPrices();
  }
}
