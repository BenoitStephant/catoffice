import { Logger } from '@nestjs/common';
import { refuse, Result, succeed } from 'libs/operation-result';
import { User } from '../type';

export interface UserGetRepository {
    find(id: string): Promise<User | null>;
}

export enum GetUserErrorReasons {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    UNKNOW_ERROR = 'UNKNOW_ERROR',
}

export function buildGetUser({ userRepository, logger }: { userRepository: UserGetRepository; logger: Logger }) {
    return async function getUser(id: string): Promise<Result<User, GetUserErrorReasons>> {
        try {
            logger.log(`Getting user`, { id });

            const user = await userRepository.find(id);

            if (!user) {
                logger.error('Failed to get user', { id, error: GetUserErrorReasons.USER_NOT_FOUND });
                return refuse(GetUserErrorReasons.USER_NOT_FOUND);
            }

            logger.log(`User found`, { id });

            return succeed(user);
        } catch (error) {
            logger.error('Failed to get user', { id, error: error.message });
            return refuse(GetUserErrorReasons.UNKNOW_ERROR);
        }
    };
}
