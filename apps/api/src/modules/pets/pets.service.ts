import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { gameConfig } from '@asterbook/config';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async getPet(userId: number) {
    let pet = await this.prisma.userPet.findUnique({
      where: { userId },
    });

    if (!pet) {
      // Create default pet
      pet = await this.prisma.userPet.create({
        data: {
          userId,
          petType: 'dragon_egg',
          stage: 1,
          hunger: 50,
        },
      });
    }

    // Calculate hunger decay
    const now = new Date();
    const lastFed = pet.lastFed;
    const hoursDiff = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= 1) {
      const decay = Math.floor(hoursDiff * gameConfig.pet.hungerDecayPerHour);
      const newHunger = Math.max(0, pet.hunger - decay);

      if (newHunger !== pet.hunger) {
        pet = await this.prisma.userPet.update({
          where: { id: pet.id },
          data: { hunger: newHunger },
        });
      }
    }

    return this.formatPet(pet);
  }

  async feedPet(userId: number) {
    const pet = await this.getPet(userId);

    if (pet.hunger >= gameConfig.pet.maxHunger) {
      throw new BadRequestException('Your pet is already full!');
    }

    const newHunger = Math.min(gameConfig.pet.maxHunger, pet.hunger + gameConfig.pet.feedAmount);
    const xpGain = 5;
    let newProgress = pet.evolutionProgress + xpGain;
    let newStage = pet.stage;
    let evolved = false;

    // Check evolution
    if (newProgress >= gameConfig.pet.evolutionThreshold * pet.stage && pet.stage < gameConfig.pet.maxStage) {
      newStage++;
      newProgress = 0;
      evolved = true;
    }

    const updatedPet = await this.prisma.userPet.update({
      where: { userId },
      data: {
        hunger: newHunger,
        lastFed: new Date(),
        evolutionProgress: newProgress,
        stage: newStage,
      },
    });

    return {
      success: true,
      message: evolved ? `AMAZING! Your pet evolved to Stage ${newStage}!` : 'Yummy! Your pet is happy.',
      pet: this.formatPet(updatedPet),
      evolved,
    };
  }

  async startExpedition(userId: number, durationHours: number = 1) {
    const pet = await this.getPet(userId);

    if (pet.stage < 2) {
      throw new BadRequestException('Your pet must be at least Stage 2 to go on expeditions');
    }

    if (pet.expeditionStatus !== 'idle') {
      throw new BadRequestException('Your pet is already on an expedition');
    }

    const expeditionEnd = new Date();
    expeditionEnd.setHours(expeditionEnd.getHours() + durationHours);

    const updatedPet = await this.prisma.userPet.update({
      where: { userId },
      data: {
        expeditionStatus: 'exploring',
        expeditionEnd,
      },
    });

    return {
      success: true,
      message: `Your pet has started a ${durationHours}h expedition!`,
      pet: this.formatPet(updatedPet),
    };
  }

  async claimExpedition(userId: number) {
    const pet = await this.getPet(userId);

    if (pet.expeditionStatus !== 'exploring') {
      throw new BadRequestException('Your pet is not on an expedition');
    }

    const now = new Date();
    if (pet.expeditionEnd && now < pet.expeditionEnd) {
      throw new BadRequestException('Expedition not complete yet');
    }

    // Calculate reward (random between 50-200 stardust based on stage)
    const baseReward = 50;
    const stageBonus = pet.stage * 25;
    const reward = baseReward + stageBonus + Math.floor(Math.random() * 100);

    // Update pet and user
    await this.prisma.$transaction([
      this.prisma.userPet.update({
        where: { userId },
        data: {
          expeditionStatus: 'idle',
          expeditionEnd: null,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          stardustCoins: { increment: reward },
        },
      }),
    ]);

    return {
      success: true,
      message: `Expedition complete! You earned ${reward} Stardust!`,
      reward,
    };
  }

  private formatPet(pet: any) {
    return {
      ...pet,
      statusText: this.getPetStatusText(pet.hunger),
      emoji: this.getPetEmoji(pet.stage),
    };
  }

  private getPetStatusText(hunger: number): string {
    if (hunger > 80) return 'Happy & Full';
    if (hunger > 50) return 'Feeling Okay';
    if (hunger > 20) return 'Hungry...';
    return 'Starving!';
  }

  private getPetEmoji(stage: number): string {
    switch (stage) {
      case 1: return '🥚';
      case 2: return '🐲';
      case 3: return '🐉';
      default: return '🥚';
    }
  }
}
