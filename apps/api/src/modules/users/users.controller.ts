import { Controller, Get, Patch, Body, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser('id') userId: number) {
    return this.usersService.findById(userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get top users leaderboard' })
  async getLeaderboard(@Query('limit') limit?: number) {
    return this.usersService.getLeaderboard(limit || 50);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() data: { bio?: string; avatar?: string; socialDiscord?: string; socialTwitter?: string; socialPortfolio?: string },
  ) {
    return this.usersService.updateProfile(userId, data);
  }
}
