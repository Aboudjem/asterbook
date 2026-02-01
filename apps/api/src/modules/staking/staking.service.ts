import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { gameConfig } from '@asterbook/config';

@Injectable()
export class StakingService {
  constructor(private prisma: PrismaService) {}

  async stake(userId: number, amount: number, durationDays: number) {
    if (amount <= 0) throw new BadRequestException('Invalid amount');
    if (durationDays < gameConfig.staking.minStakeDays || durationDays > gameConfig.staking.maxStakeDays) {
      throw new BadRequestException(`Duration must be between ${gameConfig.staking.minStakeDays} and ${gameConfig.staking.maxStakeDays} days`);
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || Number(user.stardustCoins) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      await tx.user.update({
        where: { id: userId },
        data: { stardustCoins: { decrement: amount } },
      });

      const unlocksAt = new Date();
      unlocksAt.setDate(unlocksAt.getDate() + durationDays);

      return tx.stakingVault.create({
        data: {
          userId,
          amount,
          apy: gameConfig.staking.defaultApy,
          durationDays,
          unlocksAt,
        },
      });
    });
  }

  async getVaults(userId: number) {
    return this.prisma.stakingVault.findMany({
      where: { userId },
      orderBy: { stakedAt: 'desc' },
    });
  }

  async claimVault(userId: number, vaultId: number) {
    return this.prisma.$transaction(async (tx) => {
      const vault = await tx.stakingVault.findFirst({
        where: { id: vaultId, userId, status: 'active' },
      });

      if (!vault) throw new BadRequestException('Vault not found');
      if (new Date() < vault.unlocksAt) throw new BadRequestException('Vault still locked');

      const reward = this.calculateReward(Number(vault.amount), Number(vault.apy), vault.durationDays);
      const total = Number(vault.amount) + reward;

      await tx.user.update({
        where: { id: userId },
        data: { stardustCoins: { increment: Math.floor(total) } },
      });

      return tx.stakingVault.update({
        where: { id: vaultId },
        data: { status: 'completed', claimedAt: new Date() },
      });
    });
  }

  private calculateReward(amount: number, apy: number, days: number): number {
    return amount * (apy / 100) * (days / 365);
  }
}
