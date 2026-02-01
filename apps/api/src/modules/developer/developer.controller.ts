import { Controller, Post, Get, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DeveloperService } from './developer.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Developer')
@Controller('developer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeveloperController {
  constructor(private developerService: DeveloperService) {}

  @Post('keys')
  @ApiOperation({ summary: 'Create a new API key' })
  async createApiKey(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.developerService.createApiKey(userId, dto.name);
  }

  @Get('keys')
  @ApiOperation({ summary: 'List all API keys (masked)' })
  async getApiKeys(@CurrentUser('id') userId: number) {
    return this.developerService.getApiKeys(userId);
  }

  @Delete('keys/:id')
  @ApiOperation({ summary: 'Revoke an API key' })
  @ApiParam({ name: 'id', type: 'number', description: 'API key ID' })
  async revokeApiKey(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) keyId: number,
  ) {
    return this.developerService.revokeApiKey(userId, keyId);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get API usage statistics' })
  async getUsageStats(@CurrentUser('id') userId: number) {
    return this.developerService.getUsageStats(userId);
  }
}
