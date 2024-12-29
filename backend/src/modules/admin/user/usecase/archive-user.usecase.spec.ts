import { expectRefusal } from 'libs/test-utils';
import { buildArchiveUser } from './archive-user.usecase';

describe('archiveUser', () => {
    const userRepositoryMock = {
        find: jest.fn(),
        archiveUser: jest.fn(),
    };
    const loggerMock = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };

    const archiveUser = buildArchiveUser({
        userRepository: userRepositoryMock,
        logger: loggerMock,
    });

    it('should return refusal if user not found', async () => {
        userRepositoryMock.find.mockResolvedValue(null);

        const result = await archiveUser('id', 'requesterId');

        expectRefusal(result);
    });
});
