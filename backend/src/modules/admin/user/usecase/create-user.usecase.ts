import * as bcrypt from 'bcrypt';
import { Logger } from 'libs/logger';
import { isRefusal, refuse, Result, succeed } from 'libs/operation-result';
import { PASSWORD_HASH_SALT_ROUNDS } from '../constant';
import { User, UserCreateInput } from '../type';

export interface UserCreateRepository {
    existsByEmail(email: string): Promise<boolean>;
    create(data: UserCreateInput, requesterId: string): Promise<User | null>;
}

export interface RoleUserCreationRepository {
    exists(id: string[]): Promise<boolean>;
}

export enum CreateUserErrors {
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
    UNKNOW_ERROR = 'UNKNOW_ERROR',
}

export function buildCreateUser({
    userRepository,
    roleRepository,

    logger,
}: {
    userRepository: UserCreateRepository;
    roleRepository: RoleUserCreationRepository;

    logger: Logger;
}) {
    async function checkRequirements(input: UserCreateInput): Promise<Result<boolean, CreateUserErrors>> {
        const emailExists = await userRepository.existsByEmail(input.email);
        if (emailExists) {
            logger.error('Failed to create user', { input, error: CreateUserErrors.EMAIL_ALREADY_EXISTS });
            return refuse(CreateUserErrors.EMAIL_ALREADY_EXISTS);
        }

        const roleExists = await roleRepository.exists(input.roleIds);
        if (!roleExists) {
            logger.error('Failed to create user', { input, error: CreateUserErrors.ROLE_NOT_FOUND });
            return refuse(CreateUserErrors.ROLE_NOT_FOUND);
        }

        return succeed(true);
    }

    return async function createUser(
        input: UserCreateInput,
        requesterId: string,
    ): Promise<Result<User, CreateUserErrors>> {
        try {
            logger.log(`Creating user`, { input, requesterId });

            const checkRequirementsResult = await checkRequirements(input);
            if (isRefusal(checkRequirementsResult)) {
                return checkRequirementsResult;
            }

            const hashedPassword = await hashPassword(input.password, PASSWORD_HASH_SALT_ROUNDS);
            const user = await userRepository.create(
                {
                    ...input,
                    password: hashedPassword,
                },
                requesterId,
            );

            if (!user) {
                logger.error(`Failed to create user`, { input });
                return refuse(CreateUserErrors.UNKNOW_ERROR);
            }

            logger.log(`User created`, { user });

            return succeed(user);
        } catch (error) {
            logger.error('Error during update of user', error);
            return refuse(CreateUserErrors.UNKNOW_ERROR);
        }
    };
}

async function hashPassword(password: string, round: number): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, round);

    return hashedPassword;
}
