import { Injectable, Logger } from '@nestjs/common';
import { Result } from 'libs/operation-result';
import { RoleRepository } from '../role/repository';
import { UserRepository } from './repository';
import { User, UserCreateInput, UserUpdateInput, UserWithoutRelations } from './type';
import {
    ArchiveUserErrorReasons,
    buildArchiveUser,
    buildCreateUser,
    buildGetUser,
    buildGetUserWithoutRelations,
    buildUpdateUser,
    CreateUserErrors,
    GetUserErrorReasons,
    GetUserWithoutRelationsErrorReasons,
    UpdateUserErrorReasons,
} from './usecase';
import { buildUnarchiveUser, UnarchiveUserErrorReasons } from './usecase/unarchive-user.usecase';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) {}

    create(input: UserCreateInput, requesterId: string): Promise<Result<User, CreateUserErrors>> {
        const createUser = buildCreateUser({
            userRepository: this.userRepository,
            roleRepository: this.roleRepository,

            logger: this.logger,
        });

        return createUser(input, requesterId);
    }

    update(id: string, input: UserUpdateInput, requesterId: string): Promise<Result<User, UpdateUserErrorReasons>> {
        const updateUser = buildUpdateUser({
            userRepository: this.userRepository,
            roleRepository: this.roleRepository,

            logger: this.logger,
        });

        return updateUser(id, input, requesterId);
    }

    archive(id: string, requesterId: string): Promise<Result<boolean, ArchiveUserErrorReasons>> {
        const archiveUser = buildArchiveUser({
            userRepository: this.userRepository,

            logger: this.logger,
        });

        return archiveUser(id, requesterId);
    }

    unarchive(id: string, requesterId: string): Promise<Result<boolean, UnarchiveUserErrorReasons>> {
        const unarchiveUser = buildUnarchiveUser({
            userRepository: this.userRepository,

            logger: this.logger,
        });

        return unarchiveUser(id, requesterId);
    }

    getWithoutRelations(id: string): Promise<Result<UserWithoutRelations, GetUserWithoutRelationsErrorReasons>> {
        const getUserWithoutRelations = buildGetUserWithoutRelations({
            userRepository: this.userRepository,
            logger: this.logger,
        });

        return getUserWithoutRelations(id);
    }

    get(id: string): Promise<Result<User, GetUserErrorReasons>> {
        const getUser = buildGetUser({ userRepository: this.userRepository, logger: this.logger });

        return getUser(id);
    }
}
