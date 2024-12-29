import { Logger } from 'libs/logger';
import { isRefusal, refuse, Result, succeed } from 'libs/operation-result';
import { User } from '../type';

export interface UserArchiveRepository {
    find(id: string): Promise<User | null>;
    archiveUser(id: string, archiverId: string): Promise<boolean>;
}

export enum ArchiveUserErrorReasons {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_ARCHIVED = 'USER_ALREADY_ARCHIVED',
    UNKNOW_ERROR = 'UNKNOW_ERROR',
}

export function buildArchiveUser({
    userRepository,
    logger,
}: {
    userRepository: UserArchiveRepository;
    logger: Logger;
}) {
    async function checkRequirements(id: string): Promise<Result<boolean, ArchiveUserErrorReasons>> {
        const user = await userRepository.find(id);
        if (!user) {
            logger.error('Failed to archive user', { id, reason: ArchiveUserErrorReasons.USER_NOT_FOUND });
            return refuse(ArchiveUserErrorReasons.USER_NOT_FOUND);
        }

        if (user.archivedAt) {
            logger.error('Failed to archive user', { id, reason: ArchiveUserErrorReasons.USER_ALREADY_ARCHIVED });
            return refuse(ArchiveUserErrorReasons.USER_ALREADY_ARCHIVED);
        }

        return succeed(true);
    }

    return async function archiveUser(id: string, requesterId: string) {
        try {
            logger.log(`Archiving user`, { id, requesterId });

            const checkRequirementsResult = await checkRequirements(id);
            if (isRefusal(checkRequirementsResult)) {
                return checkRequirementsResult;
            }

            const isArchived = await userRepository.archiveUser(id, requesterId);
            if (!isArchived) {
                logger.error('Failed to archive user', { id, reason: ArchiveUserErrorReasons.UNKNOW_ERROR });
                return refuse(ArchiveUserErrorReasons.UNKNOW_ERROR);
            }

            logger.log(`User archived`, { id });

            return succeed(true);
        } catch (error) {
            logger.error('Failed to archive user', { id, error });
            return refuse(ArchiveUserErrorReasons.UNKNOW_ERROR);
        }
    };
}
