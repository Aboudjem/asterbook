import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StakingService } from './staking.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Staking')
@Controller('staking')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StakingController {
  constructor(private stakingService: StakingService) {}

  @Post('stake')
  @ApiOperation({ summary: 'Stake stardust' })
  async stake(
    @CurrentUser('id') userId: number,
    @Body() body: { amount: number; durationDays: number },
  ) {
    return this.stakingService.stake(userId, body.amount, body.durationDays);
  }

  @Get('vaults')
  @ApiOperation({ summary: 'Get user vaults' })
  async getVaults(@CurrentUser('id') userId: number) {
    return this.stakingService.getVaults(userId);
  }

  @Post('vaults/:id/claim')
  @ApiOperation({ summary: 'Claim vault rewards' })
  async claimVault(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) vaultId: number,
  ) {
    return this.stakingService.claimVault(userId, vaultId);
  }
}
