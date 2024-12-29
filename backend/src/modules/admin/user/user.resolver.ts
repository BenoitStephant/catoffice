import { ConflictException, forwardRef, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { isRefusal, isSuccess } from 'libs/operation-result';
import { RoleService } from '../role';
import { RoleWithoutRelations } from '../role/model';
import { GetRoleErrorReasons } from '../role/usecase';
import { UserCreateInput, UserUpdateInput } from './gql/input';
import { User, UserWithoutRelations } from './gql/output';
import {
    ArchiveUserErrorReasons,
    CreateUserErrors,
    GetUserErrorReasons,
    GetUserWithoutRelationsErrorReasons,
    UnarchiveUserErrorReasons,
    UpdateUserErrorReasons,
} from './usecase';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        @Inject(forwardRef(() => RoleService)) private readonly roleService: RoleService,
    ) {}

    @Mutation(() => User)
    async createUser(@Args({ name: 'data', type: () => UserCreateInput }) data: UserCreateInput) {
        const result = await this.userService.create(data, 'd23676b0-b68f-42b1-ace9-97658b3918f1');

        if (isRefusal(result)) {
            if (result.reason === CreateUserErrors.EMAIL_ALREADY_EXISTS) {
                throw new ConflictException(result.reason);
            }
            if (result.reason === CreateUserErrors.ROLE_NOT_FOUND) {
                throw new NotFoundException(result.reason);
            }
            if (result.reason === CreateUserErrors.UNKNOW_ERROR) {
                throw new InternalServerErrorException(result.reason);
            }
        }
        if (!isSuccess(result)) {
            throw new InternalServerErrorException(CreateUserErrors.UNKNOW_ERROR);
        }

        return result.data;
    }

    @Mutation(() => User)
    async updateUser(
        @Args({ name: 'id', type: () => ID }) id: string,
        @Args({ name: 'data', type: () => UserUpdateInput }) data: UserUpdateInput,
    ) {
        const result = await this.userService.update(id, data, 'd23676b0-b68f-42b1-ace9-97658b3918f1');

        if (isRefusal(result)) {
            if (result.reason === UpdateUserErrorReasons.EMAIL_ALREADY_EXISTS) {
                throw new ConflictException(result.reason);
            }
            if (
                result.reason === UpdateUserErrorReasons.USER_NOT_FOUND ||
                result.reason === UpdateUserErrorReasons.ROLE_NOT_FOUND
            ) {
                throw new NotFoundException(result.reason);
            }
            if (result.reason === UpdateUserErrorReasons.UNKNOW_ERROR) {
                throw new InternalServerErrorException(result.reason);
            }
        }
        if (!isSuccess(result)) {
            throw new InternalServerErrorException(UpdateUserErrorReasons.UNKNOW_ERROR);
        }

        return result.data;
    }

    @Mutation(() => Boolean)
    async archiveUser(@Args({ name: 'id', type: () => String }) id: string) {
        const result = await this.userService.archive(id, 'd23676b0-b68f-42b1-ace9-97658b3918f1');

        if (isRefusal(result)) {
            if (result.reason === ArchiveUserErrorReasons.USER_NOT_FOUND) {
                throw new NotFoundException(result.reason);
            }
            if (result.reason === ArchiveUserErrorReasons.USER_ALREADY_ARCHIVED) {
                throw new ConflictException(result.reason);
            }
            if (result.reason === ArchiveUserErrorReasons.UNKNOW_ERROR) {
                throw new InternalServerErrorException(result.reason);
            }
        }
        if (!isSuccess(result)) {
            throw new InternalServerErrorException(ArchiveUserErrorReasons.UNKNOW_ERROR);
        }

        return result.data;
    }

    @Mutation(() => Boolean)
    async unarchiveUser(@Args({ name: 'id', type: () => String }) id: string) {
        const result = await this.userService.unarchive(id, 'd23676b0-b68f-42b1-ace9-97658b3918f1');

        if (isRefusal(result)) {
            if (result.reason === UnarchiveUserErrorReasons.USER_NOT_FOUND) {
                throw new NotFoundException(result.reason);
            }
            if (result.reason === UnarchiveUserErrorReasons.USER_NOT_ARCHIVED) {
                throw new ConflictException(result.reason);
            }
            if (result.reason === UnarchiveUserErrorReasons.UNKNOW_ERROR) {
                throw new InternalServerErrorException(result.reason);
            }
        }
        if (!isSuccess(result)) {
            throw new InternalServerErrorException(UnarchiveUserErrorReasons.UNKNOW_ERROR);
        }

        return result.data;
    }

    @Query(() => User)
    async getUser(@Args({ name: 'id', type: () => String }) id: string) {
        const result = await this.userService.get(id);

        if (isRefusal(result)) {
            if (result.reason === GetUserErrorReasons.USER_NOT_FOUND) {
                throw new NotFoundException(result.reason);
            }
            if (result.reason === GetUserErrorReasons.UNKNOW_ERROR) {
                throw new InternalServerErrorException(result.reason);
            }
        }
        if (!isSuccess(result)) {
            throw new InternalServerErrorException(GetUserErrorReasons.UNKNOW_ERROR);
        }

        return result.data;
    }

    @Query(() => UserWithoutRelations)
    async getUserWithoutRelations(@Args({ name: 'id', type: () => String }) id: string) {
        return this.getUserWithoutRelationsShared(id);
    }

    @ResolveField(() => UserWithoutRelations, { nullable: true })
    async creator(@Parent() user: User) {
        const { creatorId } = user;

        if (!creatorId) {
            return null;
        }

        return this.getUserWithoutRelationsShared(creatorId);
    }

    @ResolveField(() => UserWithoutRelations, { nullable: true })
    async editor(@Parent() user: User) {
        const { editorId } = user;

        if (!editorId) {
            return null;
        }

        return this.getUserWithoutRelationsShared(editorId);
    }

    @ResolveField(() => [RoleWithoutRelations])
    async roles(@Parent() user: User) {
        const { id } = user;

        const getRoleResult = await this.roleService.getRolesForUserId(id);

        if (isRefusal(getRoleResult)) {
            if (getRoleResult.reason === GetRoleErrorReasons.ROLE_NOT_FOUND) {
                throw new NotFoundException(getRoleResult.reason);
            }
            if (getRoleResult.reason === GetRoleErrorReasons.UNKNOWN_ERROR) {
                throw new InternalServerErrorException(getRoleResult.reason);
            }
        }
        if (!isSuccess(getRoleResult)) {
            throw new InternalServerErrorException(GetRoleErrorReasons.UNKNOWN_ERROR);
        }

        return getRoleResult.data;
    }

    @ResolveField(() => UserWithoutRelations)
    async archiver(@Parent() user: User) {
        const { archiverId } = user;

        if (!archiverId) {
            return null;
        }

        return this.getUserWithoutRelationsShared(archiverId);
    }

    private async getUserWithoutRelationsShared(id: string) {
        const result = await this.userService.getWithoutRelations(id);

        if (isRefusal(result)) {
            if (result.reason === GetUserWithoutRelationsErrorReasons.USER_NOT_FOUND) {
                throw new NotFoundException(result.reason);
            }
            if (result.reason === GetUserWithoutRelationsErrorReasons.UNKNOW_ERROR) {
                throw new InternalServerErrorException(result.reason);
            }
        }
        if (!isSuccess(result)) {
            throw new InternalServerErrorException(GetUserWithoutRelationsErrorReasons.UNKNOW_ERROR);
        }

        return result.data;
    }
}
