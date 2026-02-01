import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ArenaService } from './arena.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Arena')
@Controller('arena')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ArenaController {
  constructor(private arenaService: ArenaService) {}

  @Post('pve/battle')
  @ApiOperation({ summary: 'Fight in PvE arena' })
  async fight(
    @CurrentUser('id') userId: number,
    @Body() body: { betAmount: number },
  ) {
    return this.arenaService.fight(userId, body.betAmount);
  }

  @Get('pvp/lobbies')
  @ApiOperation({ summary: 'Get open PvP lobbies' })
  async getOpenLobbies() {
    return this.arenaService.getOpenLobbies();
  }

  @Post('pvp/lobby')
  @ApiOperation({ summary: 'Create PvP lobby' })
  async createLobby(
    @CurrentUser('id') userId: number,
    @Body() body: { betAmount: number },
  ) {
    return this.arenaService.createLobby(userId, body.betAmount);
  }

  @Post('pvp/lobby/:id/join')
  @ApiOperation({ summary: 'Join PvP lobby' })
  async joinLobby(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) lobbyId: number,
  ) {
    return this.arenaService.joinLobby(userId, lobbyId);
  }

  @Delete('pvp/lobby/:id')
  @ApiOperation({ summary: 'Cancel PvP lobby' })
  async cancelLobby(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) lobbyId: number,
  ) {
    return this.arenaService.cancelLobby(userId, lobbyId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get battle history' })
  async getBattleHistory(
    @CurrentUser('id') userId: number,
    @Query('limit') limit?: number,
  ) {
    return this.arenaService.getBattleHistory(userId, limit);
  }
}
