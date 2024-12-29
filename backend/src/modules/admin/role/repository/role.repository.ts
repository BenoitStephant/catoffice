import { Injectable } from '@nestjs/common';
import { RoleUserCreationRepository } from 'modules/admin/user/usecase';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { RoleGetRepository } from '../usecase';

@Injectable()
export class RoleRepository implements RoleGetRepository, RoleUserCreationRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findRolesForUserId(userId: string) {
        return this.prismaService.role.findMany({
            where: {
                userOnRole: {
                    some: {
                        userId,
                    },
                },
            },
        });
    }

    async exists(id: string[]): Promise<boolean> {
        const roles = await this.prismaService.role.findMany({
            where: {
                id: {
                    in: id,
                },
            },
        });

        return roles.length === id.length;
    }
}
