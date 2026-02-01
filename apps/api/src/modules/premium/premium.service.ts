import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PremiumService {
  constructor(private prisma: PrismaService) {}

  async getStatus(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPremium: true,
        premiumExpiresAt: true,
        premiumTrialUsed: true,
        paymentStatus: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if premium has expired
    if (user.isPremium && user.premiumExpiresAt) {
      if (new Date() > user.premiumExpiresAt) {
        // Auto-expire premium
        await this.prisma.user.update({
          where: { id: userId },
          data: { isPremium: false, paymentStatus: 'expired' },
        });
        return {
          isPremium: false,
          expiresAt: null,
          trialUsed: user.premiumTrialUsed,
          status: 'expired',
        };
      }
    }

    return {
      isPremium: user.isPremium,
      expiresAt: user.premiumExpiresAt,
      trialUsed: user.premiumTrialUsed,
      status: user.paymentStatus,
    };
  }

  async activatePremium(userId: number, durationDays: number, txHash?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true, premiumExpiresAt: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Calculate new expiration date
    let expiresAt: Date;
    if (user.isPremium && user.premiumExpiresAt && user.premiumExpiresAt > new Date()) {
      // Extend existing premium
      expiresAt = new Date(user.premiumExpiresAt);
      expiresAt.setDate(expiresAt.getDate() + durationDays);
    } else {
      // New premium subscription
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumExpiresAt: expiresAt,
        paymentStatus: 'active',
        txHash: txHash || null,
      },
    });

    return {
      isPremium: true,
      expiresAt: updatedUser.premiumExpiresAt,
      message: `Premium activated for ${durationDays} days`,
    };
  }

  async activateTrial(userId: number) {
    const isEligible = await this.isTrialEligible(userId);
    if (!isEligible) {
      throw new BadRequestException('Trial not available');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7-day trial

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumExpiresAt: expiresAt,
        premiumTrialUsed: true,
        paymentStatus: 'trial',
      },
    });

    return {
      isPremium: true,
      expiresAt,
      message: '7-day premium trial activated!',
    };
  }

  async isTrialEligible(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true, premiumTrialUsed: true },
    });

    if (!user) return false;
    if (user.isPremium) return false;
    if (user.premiumTrialUsed) return false;

    // Check deadline (trial offer ends 2026-01-25)
    const deadline = new Date('2026-01-25T23:59:59Z');
    if (new Date() > deadline) return false;

    return true;
  }
}
