import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { gameConfig } from '@asterbook/config';

@Injectable()
export class SentinelService {
  constructor(private prisma: PrismaService) {}

  async analyze(): Promise<string[]> {
    const alerts: string[] = [];
    const users = await this.prisma.user.findMany({
      select: { id: true, username: true, stardustCoins: true },
    });
    const now = Date.now();

    for (const user of users) {
      const currentBalance = Number(user.stardustCoins);

      const snapshot = await this.prisma.sentinelSnapshot.findUnique({
        where: { userId: user.id },
      });

      if (snapshot) {
        const lastBalance = Number(snapshot.lastBalance);
        const timeDiff = (now - snapshot.lastCheckTime.getTime()) / 1000;

        if (currentBalance > lastBalance && timeDiff > 0) {
          const gain = currentBalance - lastBalance;
          const minutes = Math.max(1, timeDiff / 60);
          const velocity = gain / minutes;

          if (velocity > gameConfig.sentinel.maxGainPerMinute) {
            await this.triggerAlert(user.id, 'HIGH_VELOCITY', `Gained ${gain} in ${timeDiff}s. Rate: ${Math.round(velocity)}/min`);
            await this.freezeUser(user.id);
            alerts.push(`User ${user.id} frozen (Velocity: ${velocity})`);
          }
        }
      }

      if (currentBalance > gameConfig.sentinel.maxBalance) {
        await this.triggerAlert(user.id, 'BALANCE_OVERFLOW', `Balance ${currentBalance} exceeds max ${gameConfig.sentinel.maxBalance}`);
        await this.freezeUser(user.id);
        alerts.push(`User ${user.id} frozen (Balance Overflow)`);
      }

      await this.updateSnapshot(user.id, currentBalance);
    }

    return alerts;
  }

  private async triggerAlert(userId: number, ruleName: string, details: string) {
    await this.prisma.sentinelAlert.create({
      data: { userId, ruleName, details },
    });
  }

  private async freezeUser(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isFrozen: true },
    });
  }

  private async updateSnapshot(userId: number, balance: number) {
    await this.prisma.sentinelSnapshot.upsert({
      where: { userId },
      update: { lastBalance: BigInt(balance), lastCheckTime: new Date() },
      create: { userId, lastBalance: BigInt(balance), lastCheckTime: new Date() },
    });
  }
}
