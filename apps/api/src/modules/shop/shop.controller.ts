import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get('items')
  @ApiOperation({ summary: 'Get shop items' })
  async getItems(@Query('category') category?: string) {
    return this.shopService.getItems(category);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('inventory')
  @ApiOperation({ summary: 'Get user inventory' })
  async getInventory(@CurrentUser('id') userId: number, @Query('category') category?: string) {
    return this.shopService.getUserInventory(userId, category);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('buy')
  @ApiOperation({ summary: 'Buy item' })
  async buyItem(@CurrentUser('id') userId: number, @Body() body: { itemId: number }) {
    return this.shopService.buyItem(userId, body.itemId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('equip')
  @ApiOperation({ summary: 'Equip item' })
  async equipItem(
    @CurrentUser('id') userId: number,
    @Body() body: { itemId: number; slot: 'banner' | 'border' | 'name_effect' },
  ) {
    return this.shopService.equipItem(userId, body.itemId, body.slot);
  }
}
