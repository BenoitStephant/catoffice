import { Logger } from '@nestjs/common';
import { refuse, Result, succeed } from 'libs/operation-result';
import { Role } from '../type';

export interface RoleGetRepository {
    findRolesForUserId(userId: string): Promise<Role[]>;
}

export enum GetRoleErrorReasons {
    ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export function buildGetRolesForUserId({ roleRepository }: { roleRepository: RoleGetRepository }) {
    return async function getRolesForUserId(userId: string): Promise<Result<Role[], GetRoleErrorReasons>> {
        const logger = new Logger(getRolesForUserId.name);

        logger.log('Getting role for user', { userId });

        try {
            const roles = await roleRepository.findRolesForUserId(userId);

            return succeed(roles);
        } catch (error) {
            logger.error('Failed to get role', { userId, error: error.message });
            return refuse(GetRoleErrorReasons.UNKNOWN_ERROR);
        }
    };
}
