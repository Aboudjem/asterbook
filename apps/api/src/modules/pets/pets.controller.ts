import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Pets')
@Controller('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user pet' })
  async getPet(@CurrentUser('id') userId: number) {
    return this.petsService.getPet(userId);
  }

  @Post('feed')
  @ApiOperation({ summary: 'Feed pet' })
  async feedPet(@CurrentUser('id') userId: number) {
    return this.petsService.feedPet(userId);
  }

  @Post('expedition/start')
  @ApiOperation({ summary: 'Start pet expedition' })
  async startExpedition(
    @CurrentUser('id') userId: number,
    @Body() body: { durationHours?: number },
  ) {
    return this.petsService.startExpedition(userId, body.durationHours);
  }

  @Post('expedition/claim')
  @ApiOperation({ summary: 'Claim expedition rewards' })
  async claimExpedition(@CurrentUser('id') userId: number) {
    return this.petsService.claimExpedition(userId);
  }
}
