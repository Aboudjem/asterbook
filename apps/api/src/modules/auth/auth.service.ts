import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already registered');
      }
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        stardustCoins: BigInt(0),
      },
    });

    // Create default pet (egg)
    await this.prisma.userPet.create({
      data: {
        userId: user.id,
        petType: 'dragon_egg',
        stage: 1,
        hunger: 50,
      },
    });

    // Create user balance
    await this.prisma.userBalance.create({
      data: {
        userId: user.id,
        balance: 1000,
      },
    });

    const token = this.generateToken(user.id, user.email);

    return {
      accessToken: token,
      user: this.sanitizeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isFrozen) {
      throw new UnauthorizedException('Account is frozen. Contact support.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last seen
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastSeen: new Date() },
    });

    const token = this.generateToken(user.id, user.email);

    return {
      accessToken: token,
      user: this.sanitizeUser(user),
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.isFrozen) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async isPremium(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true, premiumExpiresAt: true },
    });

    if (!user || !user.isPremium) return false;

    // Check if premium has expired
    if (user.premiumExpiresAt && new Date() > user.premiumExpiresAt) {
      // Update user to non-premium
      await this.prisma.user.update({
        where: { id: userId },
        data: { isPremium: false, paymentStatus: 'expired' },
      });
      return false;
    }

    return true;
  }

  private generateToken(userId: number, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return {
      ...sanitized,
      stardustCoins: Number(sanitized.stardustCoins),
      totalOnlineTime: Number(sanitized.totalOnlineTime),
    };
  }
}
