import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RefreshToken, RefreshTokenCreateInput } from '../type';
import { RefreshTokenCreateRepository } from '../usecase';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenCreateRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: RefreshTokenCreateInput): Promise<RefreshToken> {
        return this.prisma.refreshToken.create({
            data,
        });
    }

    async revokeAllActive(userId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
    }
}
