import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { rankingTiers } from '@asterbook/config';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        profileBanner: true,
        bio: true,
        socialDiscord: true,
        socialTwitter: true,
        socialPortfolio: true,
        wallet: true,
        isPremium: true,
        premiumExpiresAt: true,
        stardustCoins: true,
        totalOnlineTime: true,
        lastSeen: true,
        createdAt: true,
      },
    });
  }

  async getLeaderboard(limit = 50) {
    const users = await this.prisma.user.findMany({
      orderBy: { stardustCoins: 'desc' },
      take: limit,
      select: {
        id: true,
        username: true,
        avatar: true,
        stardustCoins: true,
        isPremium: true,
      },
    });

    return users.map((user, index) => ({
      rank: index + 1,
      ...user,
      stardustCoins: Number(user.stardustCoins),
      tier: this.getUserTier(Number(user.stardustCoins)),
    }));
  }

  getUserTier(coins: number) {
    let tier: (typeof rankingTiers)[number] = rankingTiers[0]!;
    for (const t of rankingTiers) {
      if (coins >= t.minCoins) {
        tier = t;
      } else {
        break;
      }
    }
    return tier;
  }

  async updateProfile(userId: number, data: { bio?: string; avatar?: string; socialDiscord?: string; socialTwitter?: string; socialPortfolio?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateOnlineTime(userId: number, additionalSeconds: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        totalOnlineTime: { increment: additionalSeconds },
        lastSeen: new Date(),
      },
    });
  }
}
