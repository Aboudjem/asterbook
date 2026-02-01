import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { gameConfig } from '@asterbook/config';


@Injectable()
export class ArenaService {
  constructor(private prisma: PrismaService) {}

  // PvE Battle
  async fight(userId: number, betAmount: number) {
    if (betAmount <= 0) {
      throw new BadRequestException('Invalid bet amount');
    }

    return this.prisma.$transaction(async (tx) => {
      // Get user with lock
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user || Number(user.stardustCoins) < betAmount) {
        throw new BadRequestException(`Insufficient Stardust! You need ${betAmount.toLocaleString()} coins.`);
      }

      // Get pet
      const pet = await tx.userPet.findUnique({
        where: { userId },
      });

      if (!pet) {
        throw new BadRequestException("You don't have a pet yet!");
      }

      if (pet.stage < 2) {
        throw new BadRequestException('Your pet is too young to fight! Evolve it first.');
      }

      if (pet.hunger <= 10) {
        throw new BadRequestException('Your pet is too hungry to fight! Feed it first.');
      }

      // Deduct bet
      await tx.user.update({
        where: { id: userId },
        data: { stardustCoins: { decrement: betAmount } },
      });

      // Calculate outcome
      const winChance = this.calculateWinProbability(pet.stage, pet.hunger);
      const roll = Math.random();
      const isWin = roll <= winChance;

      const fee = betAmount * gameConfig.arena.feePercent;
      let reward = 0;
      let resultStatus: 'win' | 'loss' = 'loss';

      if (isWin) {
        resultStatus = 'win';
        const grossReward = betAmount * 2;
        reward = grossReward - fee;

        // Credit reward
        await tx.user.update({
          where: { id: userId },
          data: { stardustCoins: { increment: Math.floor(reward) } },
        });
      }

      // Log battle
      await tx.arenaBattle.create({
        data: {
          userId,
          petId: pet.id,
          betAmount: betAmount,
          feeAmount: isWin ? fee : betAmount,
          winChance,
          result: resultStatus,
          rewardAmount: reward,
        },
      });

      // Reduce hunger
      const newHunger = Math.max(0, pet.hunger - gameConfig.pet.hungerCostPerFight);
      await tx.userPet.update({
        where: { id: pet.id },
        data: { hunger: newHunger },
      });

      // Get updated balance
      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { stardustCoins: true },
      });

      return {
        result: resultStatus,
        roll,
        winChance,
        reward: Math.floor(reward),
        newBalance: Number(updatedUser?.stardustCoins || 0),
        petHunger: newHunger,
        message: isWin ? 'Victory! Your pet fought bravely.' : 'Defeat! Better luck next time.',
      };
    });
  }

  // PvP Create Lobby
  async createLobby(userId: number, betAmount: number) {
    if (betAmount <= 0) {
      throw new BadRequestException('Invalid bet amount');
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });

      if (!user || Number(user.stardustCoins) < betAmount) {
        throw new BadRequestException('Insufficient Stardust');
      }

      // Check existing lobbies
      const existingLobby = await tx.arenaLobby.findFirst({
        where: { creatorId: userId, status: 'waiting' },
      });

      if (existingLobby) {
        throw new BadRequestException('You already have an open lobby');
      }

      // Deduct bet
      await tx.user.update({
        where: { id: userId },
        data: { stardustCoins: { decrement: betAmount } },
      });

      // Create lobby
      const lobby = await tx.arenaLobby.create({
        data: {
          creatorId: userId,
          betAmount: betAmount,
          status: 'waiting',
        },
      });

      return lobby;
    });
  }

  // PvP Join Lobby
  async joinLobby(userId: number, lobbyId: number) {
    return this.prisma.$transaction(async (tx) => {
      const lobby = await tx.arenaLobby.findUnique({
        where: { id: lobbyId },
      });

      if (!lobby || lobby.status !== 'waiting') {
        throw new BadRequestException('Lobby not available');
      }

      if (lobby.creatorId === userId) {
        throw new BadRequestException('Cannot join your own lobby');
      }

      const betAmount = Number(lobby.betAmount);
      const user = await tx.user.findUnique({ where: { id: userId } });

      if (!user || Number(user.stardustCoins) < betAmount) {
        throw new BadRequestException('Insufficient Stardust');
      }

      // Deduct bet from joiner
      await tx.user.update({
        where: { id: userId },
        data: { stardustCoins: { decrement: betAmount } },
      });

      // Determine winner (50/50)
      const winnerId = Math.random() < 0.5 ? lobby.creatorId : userId;
      const fee = betAmount * 2 * gameConfig.arena.feePercent;
      const prize = betAmount * 2 - fee;

      // Award winner
      await tx.user.update({
        where: { id: winnerId },
        data: { stardustCoins: { increment: Math.floor(prize) } },
      });

      // Update lobby
      const updatedLobby = await tx.arenaLobby.update({
        where: { id: lobbyId },
        data: {
          joinerId: userId,
          winnerId,
          status: 'completed',
        },
      });

      return {
        lobby: updatedLobby,
        winnerId,
        prize: Math.floor(prize),
        message: winnerId === userId ? 'You won!' : 'You lost!',
      };
    });
  }

  // Cancel Lobby
  async cancelLobby(userId: number, lobbyId: number) {
    return this.prisma.$transaction(async (tx) => {
      const lobby = await tx.arenaLobby.findUnique({
        where: { id: lobbyId },
      });

      if (!lobby || lobby.creatorId !== userId) {
        throw new BadRequestException('Lobby not found');
      }

      if (lobby.status !== 'waiting') {
        throw new BadRequestException('Cannot cancel this lobby');
      }

      // Refund
      await tx.user.update({
        where: { id: userId },
        data: { stardustCoins: { increment: Number(lobby.betAmount) } },
      });

      // Update lobby
      return tx.arenaLobby.update({
        where: { id: lobbyId },
        data: { status: 'cancelled' },
      });
    });
  }

  // Get open lobbies
  async getOpenLobbies() {
    return this.prisma.arenaLobby.findMany({
      where: { status: 'waiting' },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
  }

  // Get battle history
  async getBattleHistory(userId: number, limit = 20) {
    return this.prisma.arenaBattle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private calculateWinProbability(petStage: number, petHunger: number): number {
    const { arena } = gameConfig;
    let chance = arena.baseWinChance;

    // Stage bonus
    if (petStage > 1) {
      chance += (petStage - 1) * arena.stageBonus;
    }

    // Hunger penalty
    if (petHunger < arena.hungerPenaltyThreshold) {
      const deficit = arena.hungerPenaltyThreshold - petHunger;
      chance -= deficit * arena.hungerPenaltyFactor;
    }

    return Math.max(arena.minWinChance, Math.min(arena.maxWinChance, chance));
  }
}
