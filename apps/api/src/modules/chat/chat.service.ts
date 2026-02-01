import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: number) {
    const conversations = await this.prisma.chatConversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                lastSeen: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return conversations.map((conv) => ({
      id: conv.id,
      type: conv.type,
      createdAt: conv.createdAt,
      participants: conv.participants
        .filter((p) => p.userId !== userId)
        .map((p) => p.user),
      lastMessage: conv.messages[0] || null,
    }));
  }

  async createConversation(userId: number, targetUserId: number) {
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Check if direct conversation already exists between these users
    const existingConversation = await this.prisma.chatConversation.findFirst({
      where: {
        type: 'direct',
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                lastSeen: true,
              },
            },
          },
        },
      },
    });

    if (existingConversation) {
      return {
        id: existingConversation.id,
        type: existingConversation.type,
        createdAt: existingConversation.createdAt,
        participants: existingConversation.participants
          .filter((p) => p.userId !== userId)
          .map((p) => p.user),
      };
    }

    // Create new conversation with both participants
    const conversation = await this.prisma.chatConversation.create({
      data: {
        type: 'direct',
        participants: {
          create: [{ userId }, { userId: targetUserId }],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                lastSeen: true,
              },
            },
          },
        },
      },
    });

    return {
      id: conversation.id,
      type: conversation.type,
      createdAt: conversation.createdAt,
      participants: conversation.participants
        .filter((p) => p.userId !== userId)
        .map((p) => p.user),
    };
  }

  async getMessages(conversationId: number, userId: number, limit = 50, offset = 0) {
    // Verify user is participant
    const isParticipant = await this.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Return in chronological order
    return messages.reverse();
  }

  async sendMessage(conversationId: number, senderId: number, message: string) {
    // Verify sender is participant
    const isParticipant = await this.isParticipant(conversationId, senderId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const newMessage = await this.prisma.chatMessage.create({
      data: {
        conversationId,
        senderId,
        message,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return newMessage;
  }

  async isParticipant(conversationId: number, userId: number): Promise<boolean> {
    const participant = await this.prisma.chatParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    return !!participant;
  }

  async getConversation(conversationId: number, userId: number) {
    const isParticipant = await this.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const conversation = await this.prisma.chatConversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                lastSeen: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      id: conversation.id,
      type: conversation.type,
      createdAt: conversation.createdAt,
      participants: conversation.participants
        .filter((p) => p.userId !== userId)
        .map((p) => p.user),
    };
  }
}
