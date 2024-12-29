import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'modules/admin/user';
import { PrismaService } from 'prisma/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { RefreshTokenRepository } from './repositories';

@Module({
    imports: [ConfigModule, JwtModule, UserModule],
    providers: [AuthResolver, AuthService, RefreshTokenRepository, PrismaService],
})
export class AuthModule {}
