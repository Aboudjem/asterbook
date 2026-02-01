import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { questTypes, gameConfig } from '@asterbook/config';

@Injectable()
export class QuestsService {
  constructor(private prisma: PrismaService) {}

  private getBatchId(): string {
    const now = new Date();
    const block = Math.floor(now.getHours() / gameConfig.quests.batchDurationHours);
    return `${now.toISOString().split('T')[0]}-block-${block}`;
  }

  async getQuests(userId: number) {
    const batchId = this.getBatchId();
    const today = new Date().toISOString().split('T')[0];

    let quests = await this.prisma.dailyQuest.findMany({
      where: { userId, batchId },
    });

    if (quests.length < gameConfig.quests.questsPerBatch) {
      const existingTypes = quests.map(q => q.questType);
      const available = questTypes.filter(q => !existingTypes.includes(q.type));
      const needed = gameConfig.quests.questsPerBatch - quests.length;
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      const newQuests = shuffled.slice(0, needed);

      for (const q of newQuests) {
        await this.prisma.dailyQuest.create({
          data: {
            userId,
            questType: q.type,
            description: q.desc,
            targetCount: 1,
            rewardAmount: q.reward,
            dateAssigned: new Date(today),
            batchId,
          },
        });
      }

      quests = await this.prisma.dailyQuest.findMany({
        where: { userId, batchId },
      });
    }

    return quests;
  }

  async trackProgress(userId: number, questType: string) {
    const batchId = this.getBatchId();

    const quests = await this.prisma.dailyQuest.findMany({
      where: { userId, batchId, questType, status: 'active' },
    });

    for (const quest of quests) {
      const newProgress = quest.currentProgress + 1;

      if (newProgress >= quest.targetCount) {
        await this.prisma.$transaction([
          this.prisma.dailyQuest.update({
            where: { id: quest.id },
            data: { currentProgress: newProgress, status: 'completed' },
          }),
          this.prisma.user.update({
            where: { id: userId },
            data: { stardustCoins: { increment: quest.rewardAmount } },
          }),
        ]);
      } else {
        await this.prisma.dailyQuest.update({
          where: { id: quest.id },
          data: { currentProgress: newProgress },
        });
      }
    }
  }
}
