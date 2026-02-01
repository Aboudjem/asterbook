import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async getItems(category?: string) {
    return this.prisma.shopItem.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ price: 'asc' }, { minRankLevel: 'asc' }],
    });
  }

  async getUserInventory(userId: number, category?: string) {
    const where: any = { userId };
    if (category) {
      where.item = { category };
    }
    return this.prisma.userInventory.findMany({
      where,
      include: { item: true },
    });
  }

  async buyItem(userId: number, itemId: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.shopItem.findUnique({ where: { id: itemId } });
      if (!item) throw new BadRequestException('Item not found');

      const existing = await tx.userInventory.findFirst({
        where: { userId, itemId },
      });
      if (existing) throw new BadRequestException('You already own this item');

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || Number(user.stardustCoins) < Number(item.price)) {
        throw new BadRequestException('Insufficient balance');
      }

      await tx.user.update({
        where: { id: userId },
        data: { stardustCoins: { decrement: Number(item.price) } },
      });

      return tx.userInventory.create({
        data: { userId, itemId },
      });
    });
  }

  async equipItem(userId: number, itemId: number, slot: 'banner' | 'border' | 'name_effect') {
    const inventory = await this.prisma.userInventory.findFirst({
      where: { userId, itemId },
      include: { item: true },
    });

    if (!inventory) throw new BadRequestException('You do not own this item');
    if (inventory.item.category !== slot) throw new BadRequestException('Invalid slot for this item');

    const updateData: any = {};
    if (slot === 'banner') updateData.activeBannerId = itemId;
    if (slot === 'border') updateData.activeBorderId = itemId;
    if (slot === 'name_effect') updateData.activeNameEffectId = itemId;

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
