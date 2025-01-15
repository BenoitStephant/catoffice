import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserGetForLoginRepository } from 'modules/auth/usecase';
import { PrismaService } from 'prisma/prisma.service';
import { User, UserCreateInput, UserForLogin, UserUpdateInput, UserWithoutRelations } from '../type';
import {
    UserArchiveRepository,
    UserCreateRepository,
    UserGetRepository,
    UserGetWithoutRelationsRepository,
} from '../usecase';
import { UserUnarchiveRepository } from '../usecase/unarchive-user.usecase';
import { UserUpdateRepository } from '../usecase/update-user.usecase';

@Injectable()
export class UserRepository
    implements
        UserCreateRepository,
        UserGetRepository,
        UserGetWithoutRelationsRepository,
        UserGetForLoginRepository,
        UserUpdateRepository,
        UserArchiveRepository,
        UserUnarchiveRepository
{
    constructor(private readonly prisma: PrismaService) {}

    async existsByEmail(email: string, ExcludeId?: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email, NOT: { id: ExcludeId } },
        });

        return !!user;
    }

    async exists(id: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        return !!user;
    }

    async create(data: UserCreateInput, creatorId: string): Promise<User> {
        const { roleIds, ...rest } = data;
        const userCreated = await this.prisma.user.create({
            data: {
                ...rest,
                creatorId,
                editorId: creatorId,
                rolesOnUser: {
                    create: roleIds.map((roleId) => ({
                        role: {
                            connect: { id: roleId },
                        },
                        assignedByUser: {
                            connect: { id: creatorId },
                        },
                    })),
                },
            },
            include: {
                rolesOnUser: true,
            },
        });

        if (!userCreated) {
            throw new Error('Cannot create user');
        }

        return {
            ...userCreated,
            archivedAt: null,
            archiverId: null,
            roleIds,
        };
    }

    async update(id: string, data: UserUpdateInput, editorId: string): Promise<User> {
        const { roleIds, ...rest } = data;
        const previousRoleIds = (
            await this.prisma.roleOnUser.findMany({
                where: { userId: id },
                select: { roleId: true },
            })
        ).map((rolesOnUser) => rolesOnUser.roleId);
        const roleIdsToUnassigned = previousRoleIds.filter((previousRoleId) => !roleIds.includes(previousRoleId));
        const roleIdsToAssigned = roleIds.filter((roleId) => !previousRoleIds.includes(roleId));
        const userUpdated = await this.prisma.user.update({
            data: {
                ...rest,
                editorId,
                rolesOnUser: {
                    create: roleIdsToAssigned.map((roleIdToAssigned) => ({
                        role: {
                            connect: { id: roleIdToAssigned },
                        },
                        assignedByUser: {
                            connect: { id: editorId },
                        },
                    })),
                    updateMany: {
                        data: {
                            unassignedAt: new Date(),
                            unassignedBy: editorId,
                        },
                        where: {
                            roleId: {
                                in: roleIdsToUnassigned,
                            },
                        },
                    },
                },
            },
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                archivationHistory: this.getArchivationHistorySelect(id),
                rolesOnUser: {
                    select: {
                        roleId: true,
                    },
                },
                creatorId: true,
                editorId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!userUpdated) {
            throw new Error('Failed to update user');
        }

        return {
            ...userUpdated,
            archivedAt: userUpdated.archivationHistory[0]?.archivedAt,
            archiverId: userUpdated.archivationHistory[0]?.archiverId,
            roleIds: userUpdated.rolesOnUser.map((role) => role.roleId),
        };
    }

    async find(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                archivationHistory: this.getArchivationHistorySelect(id),
                rolesOnUser: {
                    select: {
                        roleId: true,
                    },
                },
                creatorId: true,
                editorId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return null;
        }

        return {
            ...user,
            archivedAt: user.archivationHistory[0]?.archivedAt,
            archiverId: user.archivationHistory[0]?.archiverId,
            roleIds: user.rolesOnUser.map((role) => role.roleId),
        };
    }

    async findWithoutRelations(id: string): Promise<UserWithoutRelations | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                archivationHistory: this.getArchivationHistorySelect(id),
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return null;
        }

        return {
            ...user,
            archivedAt: user.archivationHistory[0]?.archivedAt,
        };
    }

    async getUserByEmail(email: string, id?: string): Promise<UserForLogin | null> {
        const user = await this.prisma.user.findUnique({
            where: { email, ...(id && { id: id }) },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                password: true,
                rolesOnUser: {
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });

        return user ? { ...user, roleNames: user.rolesOnUser.map((role) => role.role.name) } : null;
    }

    async archiveUser(id: string, archiverId: string): Promise<boolean> {
        const userArchivation = await this.prisma.userArchivationHistory.create({
            data: { userId: id, archiverId: archiverId, archivedAt: new Date() },
        });

        return userArchivation.archivedAt !== null;
    }

    async unarchiveUser(id: string, unarchiverId: string): Promise<boolean> {
        const lastUserArchivation = await this.prisma.userArchivationHistory.findFirst({
            where: { userId: id },
            orderBy: { archivedAt: Prisma.SortOrder.desc },
        });

        if (!lastUserArchivation) {
            return false;
        }

        const userUnarchived = await this.prisma.userArchivationHistory.update({
            data: { unarchivedAt: new Date(), unarchiverId },
            where: { id: lastUserArchivation.id },
        });

        return userUnarchived.unarchivedAt !== null;
    }

    getArchivationHistorySelect(id: string) {
        return {
            select: {
                archivedAt: true,
                archiverId: true,
            },
            orderBy: {
                archivedAt: Prisma.SortOrder.desc,
            },
            where: { userId: id, unarchivedAt: null },
        };
    }
}
