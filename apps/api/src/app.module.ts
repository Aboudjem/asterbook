import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PetsModule } from './modules/pets/pets.module';
import { ArenaModule } from './modules/arena/arena.module';
import { StakingModule } from './modules/staking/staking.module';
import { ShopModule } from './modules/shop/shop.module';
import { QuestsModule } from './modules/quests/quests.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { ChatModule } from './modules/chat/chat.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { SecurityModule } from './modules/security/security.module';
import { AdminModule } from './modules/admin/admin.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { PremiumModule } from './modules/premium/premium.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PetsModule,
    ArenaModule,
    StakingModule,
    ShopModule,
    QuestsModule,
    MarketplaceModule,
    ChatModule,
    DeveloperModule,
    SecurityModule,
    AdminModule,
    BlockchainModule,
    PremiumModule,
  ],
})
export class AppModule {}
