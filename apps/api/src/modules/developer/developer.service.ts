import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DeveloperService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new API key for a user
   * Returns the raw key (only shown once) and masked version
   */
  async createApiKey(userId: number, name: string) {
    // Generate a secure random API key
    const rawApiKey = `ab_${crypto.randomBytes(32).toString('hex')}`;

    // Hash the API key for storage
    const apiKeyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');

    // Store only the first 8 chars for identification (masked display)
    const maskedKey = `${rawApiKey.substring(0, 10)}...${rawApiKey.substring(rawApiKey.length - 4)}`;

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        name,
        apiKey: rawApiKey.substring(0, 64), // Store truncated version for lookup
        apiKeyHash,
        status: 'active',
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      apiKey: rawApiKey, // Full key - only returned on creation
      maskedKey,
      status: apiKey.status,
      createdAt: apiKey.createdAt,
      message: 'Store this API key securely. It will not be shown again.',
    };
  }

  /**
   * Validate an API key and return the associated user
   */
  async validateApiKey(rawApiKey: string) {
    if (!rawApiKey || !rawApiKey.startsWith('ab_')) {
      return null;
    }

    // Hash the provided key
    const apiKeyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');

    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        apiKeyHash,
        status: 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isPremium: true,
            isFrozen: true,
          },
        },
      },
    });

    if (!apiKey || apiKey.user.isFrozen) {
      return null;
    }

    // Update last used timestamp
    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      keyId: apiKey.id,
      userId: apiKey.userId,
      user: apiKey.user,
    };
  }

  /**
   * Get all API keys for a user (with masked values)
   */
  async getApiKeys(userId: number) {
    const keys = await this.prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        apiKey: true,
        status: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });

    return keys.map((key) => ({
      id: key.id,
      name: key.name,
      maskedKey: `${key.apiKey.substring(0, 10)}...`,
      status: key.status,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
    }));
  }

  /**
   * Revoke (deactivate) an API key
   */
  async revokeApiKey(userId: number, keyId: number) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    if (apiKey.status === 'revoked') {
      throw new BadRequestException('API key is already revoked');
    }

    await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { status: 'revoked' },
    });

    return { message: 'API key revoked successfully' };
  }

  /**
   * Log API usage for a specific key
   */
  async logUsage(keyId: number, endpoint: string, method: string, cost: number = 1) {
    await this.prisma.apiUsage.create({
      data: {
        apiKeyId: keyId,
        endpoint,
        method,
        cost,
      },
    });
  }

  /**
   * Get usage statistics for a user's API keys
   */
  async getUsageStats(userId: number) {
    const keys = await this.prisma.apiKey.findMany({
      where: { userId },
      select: { id: true, name: true },
    });

    const keyIds = keys.map((k) => k.id);

    if (keyIds.length === 0) {
      return {
        totalRequests: 0,
        totalCost: 0,
        byKey: [],
        byEndpoint: [],
        last24Hours: 0,
        last7Days: 0,
      };
    }

    // Get total usage
    const totalUsage = await this.prisma.apiUsage.aggregate({
      where: { apiKeyId: { in: keyIds } },
      _count: true,
      _sum: { cost: true },
    });

    // Get usage by key
    const usageByKey = await this.prisma.apiUsage.groupBy({
      by: ['apiKeyId'],
      where: { apiKeyId: { in: keyIds } },
      _count: true,
      _sum: { cost: true },
    });

    // Get usage by endpoint
    const usageByEndpoint = await this.prisma.apiUsage.groupBy({
      by: ['endpoint', 'method'],
      where: { apiKeyId: { in: keyIds } },
      _count: true,
      orderBy: { _count: { endpoint: 'desc' } },
      take: 10,
    });

    // Get last 24 hours
    const last24Hours = await this.prisma.apiUsage.count({
      where: {
        apiKeyId: { in: keyIds },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    // Get last 7 days
    const last7Days = await this.prisma.apiUsage.count({
      where: {
        apiKeyId: { in: keyIds },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    // Map key IDs to names
    const keyMap = new Map(keys.map((k) => [k.id, k.name]));

    return {
      totalRequests: totalUsage._count,
      totalCost: totalUsage._sum.cost || 0,
      byKey: usageByKey.map((u) => ({
        keyId: u.apiKeyId,
        keyName: keyMap.get(u.apiKeyId) || 'Unknown',
        requests: u._count,
        cost: u._sum.cost || 0,
      })),
      byEndpoint: usageByEndpoint.map((u) => ({
        endpoint: u.endpoint,
        method: u.method,
        requests: u._count,
      })),
      last24Hours,
      last7Days,
    };
  }
}
