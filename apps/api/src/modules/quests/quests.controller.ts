import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { QuestsService } from './quests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Quests')
@Controller('quests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestsController {
  constructor(private questsService: QuestsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current quests' })
  async getQuests(@CurrentUser('id') userId: number) {
    return this.questsService.getQuests(userId);
  }

  @Post('track')
  @ApiOperation({ summary: 'Track quest progress' })
  async trackProgress(
    @CurrentUser('id') userId: number,
    @Body() body: { questType: string },
  ) {
    await this.questsService.trackProgress(userId, body.questType);
    return { success: true };
  }
}
