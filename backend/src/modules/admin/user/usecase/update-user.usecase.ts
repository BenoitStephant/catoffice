import { Logger } from 'libs/logger';
import { isRefusal, refuse, Result, succeed } from 'libs/operation-result';
import { User, UserUpdateInput } from '../type';

export interface UserUpdateRepository {
    exists(id: string): Promise<boolean>;
    existsByEmail(email: string, id: string): Promise<boolean>;
    update(id: string, data: UserUpdateInput, editorId: string): Promise<User>;
}

export interface RoleUserUpdateRepository {
    exists(id: string[]): Promise<boolean>;
}

export enum UpdateUserErrorReasons {
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
    UNKNOW_ERROR = 'UNKNOW_ERROR',
}

export function buildUpdateUser({
    userRepository,
    roleRepository,

    logger,
}: {
    userRepository: UserUpdateRepository;
    roleRepository: RoleUserUpdateRepository;

    logger: Logger;
}) {
    async function checkRequirements(
        id: string,
        data: UserUpdateInput,
    ): Promise<Result<boolean, UpdateUserErrorReasons>> {
        const emailExists = await userRepository.existsByEmail(data.email, id);
        if (emailExists) {
            logger.error('Failed to update user', { id, data, reaon: UpdateUserErrorReasons.EMAIL_ALREADY_EXISTS });
            return refuse(UpdateUserErrorReasons.EMAIL_ALREADY_EXISTS);
        }

        const userExists = await userRepository.exists(id);
        if (!userExists) {
            logger.error('Failed to update user', { id, reason: UpdateUserErrorReasons.USER_NOT_FOUND });
            return refuse(UpdateUserErrorReasons.USER_NOT_FOUND);
        }

        const roleExists = await roleRepository.exists(data.roleIds);
        if (!roleExists) {
            logger.error('Failed to update user', {
                roleIds: data.roleIds,
                reason: UpdateUserErrorReasons.ROLE_NOT_FOUND,
            });
            return refuse(UpdateUserErrorReasons.ROLE_NOT_FOUND);
        }

        return succeed(true);
    }

    return async function updateUser(
        id: string,
        data: UserUpdateInput,
        requesterId: string,
    ): Promise<Result<User, UpdateUserErrorReasons>> {
        try {
            logger.log('Start update user', { id, data });

            const checkRequirementsResult = await checkRequirements(id, data);
            if (isRefusal(checkRequirementsResult)) {
                return checkRequirementsResult;
            }

            const userUpdated = await userRepository.update(id, data, requesterId);

            return succeed(userUpdated);
        } catch (error) {
            logger.error('Error during update user', error);
            return refuse(UpdateUserErrorReasons.UNKNOW_ERROR);
        }
    };
}
