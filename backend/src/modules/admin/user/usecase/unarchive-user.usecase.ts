import { Logger } from 'libs/logger';
import { isRefusal, refuse, Result, succeed } from 'libs/operation-result';
import { User } from '../type';

export interface UserUnarchiveRepository {
    find(id: string): Promise<User>;
    unarchiveUser(userId: string, unarchiverId: string): Promise<boolean>;
}

export enum UnarchiveUserErrorReasons {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_NOT_ARCHIVED = 'USER_NOT_ARCHIVED',
    UNKNOW_ERROR = 'UNKNOW_ERROR',
}

export function buildUnarchiveUser({
    userRepository,

    logger,
}: {
    userRepository: UserUnarchiveRepository;

    logger: Logger;
}) {
    async function checkRequirements(userId: string): Promise<Result<boolean, UnarchiveUserErrorReasons>> {
        const user = await userRepository.find(userId);

        if (!user) {
            logger.error('Failed to unarchive user', { userId, reason: UnarchiveUserErrorReasons.USER_NOT_FOUND });
            return refuse(UnarchiveUserErrorReasons.USER_NOT_FOUND);
        }

        if (!user.archivedAt) {
            logger.error('Failed to unarchive user', { userId, reason: UnarchiveUserErrorReasons.USER_NOT_ARCHIVED });
            return refuse(UnarchiveUserErrorReasons.USER_NOT_ARCHIVED);
        }

        return succeed(true);
    }

    return async function unarchiveUser(
        userId: string,
        requesterId: string,
    ): Promise<Result<boolean, UnarchiveUserErrorReasons>> {
        logger.log(`Unarchiving user`, { userId, requesterId });
        try {
            const requirementsCheckResult = await checkRequirements(userId);

            if (isRefusal(requirementsCheckResult)) {
                return requirementsCheckResult;
            }

            const isUnarchived = await userRepository.unarchiveUser(userId, requesterId);

            if (!isUnarchived) {
                logger.error('Failed to unarchive user', { userId, reason: UnarchiveUserErrorReasons.UNKNOW_ERROR });
                return refuse(UnarchiveUserErrorReasons.UNKNOW_ERROR);
            }

            logger.log(`User unarchived`, { userId });

            return succeed(true);
        } catch (error) {
            logger.error('Error during unarchive user', error);
            return refuse(UnarchiveUserErrorReasons.UNKNOW_ERROR);
        }
    };
}
