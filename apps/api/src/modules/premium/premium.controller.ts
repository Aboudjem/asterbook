import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PremiumService } from './premium.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class ActivatePremiumDto {
  durationDays: number;
  txHash?: string;
}

@Controller('api/premium')
@UseGuards(JwtAuthGuard)
export class PremiumController {
  constructor(private readonly premiumService: PremiumService) {}

  @Get('status')
  async getStatus(@CurrentUser() user: { id: number }) {
    return this.premiumService.getStatus(user.id);
  }

  @Post('activate')
  async activate(
    @CurrentUser() user: { id: number },
    @Body() dto: ActivatePremiumDto,
  ) {
    return this.premiumService.activatePremium(
      user.id,
      dto.durationDays,
      dto.txHash,
    );
  }

  @Post('trial')
  async activateTrial(@CurrentUser() user: { id: number }) {
    return this.premiumService.activateTrial(user.id);
  }

  @Get('trial/eligible')
  async checkTrialEligibility(@CurrentUser() user: { id: number }) {
    const eligible = await this.premiumService.isTrialEligible(user.id);
    return { eligible };
  }
}
