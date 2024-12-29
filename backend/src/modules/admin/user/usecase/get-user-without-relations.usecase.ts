import { Logger } from 'libs/logger';
import { refuse, Result, succeed } from 'libs/operation-result';
import { UserWithoutRelations } from '../type';

export interface UserGetWithoutRelationsRepository {
    findWithoutRelations(id: string): Promise<UserWithoutRelations | null>;
}

export enum GetUserWithoutRelationsErrorReasons {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    UNKNOW_ERROR = 'UNKNOW_ERROR',
}

export function buildGetUserWithoutRelations({
    userRepository,

    logger,
}: {
    userRepository: UserGetWithoutRelationsRepository;

    logger: Logger;
}) {
    return async function getUserWithoutRelations(
        id: string,
    ): Promise<Result<UserWithoutRelations, GetUserWithoutRelationsErrorReasons>> {
        try {
            logger.log(`Getting user without relations`, { id });

            const user = await userRepository.findWithoutRelations(id);

            if (!user) {
                logger.error('Failed to get user', { id, error: GetUserWithoutRelationsErrorReasons.USER_NOT_FOUND });
                return refuse(GetUserWithoutRelationsErrorReasons.USER_NOT_FOUND);
            }

            logger.log(`User without relations found`, { id });

            return succeed(user);
        } catch (error) {
            logger.error('Failed to get user without relations', { id, error: error.message });
            return refuse(GetUserWithoutRelationsErrorReasons.UNKNOW_ERROR);
        }
    };
}
