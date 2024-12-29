import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { refuse, Result, succeed } from 'libs/operation-result';
import { UserForAccessTokenPayload, UserForLogin, UserForRefreshTokenPayload } from 'modules/admin/user/type';
import { LoginOutput, RefreshToken, RefreshTokenCreateInput } from '../type';

export interface UserGetForLoginRepository {
    getUserByEmail(email: string, id?: string): Promise<UserForLogin>;
}

export interface RefreshTokenCreateRepository {
    create(input: RefreshTokenCreateInput): Promise<RefreshToken>;
    revokeAllActive(userId: string): Promise<void>;
}

export enum LoginUserErrorReasons {
    BAD_CREDENTIALS = 'BAD_CREDENTIALS',
    UNKNOW_ERROR = 'UNKNOW_ERROR',
}

export function buildLoginUser(
    {
        userRepository,
        refreshTokenRepository,

        createAccessToken,
        createRefreshToken,
    }: {
        userRepository: UserGetForLoginRepository;
        refreshTokenRepository: RefreshTokenCreateRepository;

        createAccessToken: (payload: UserForAccessTokenPayload) => Promise<string>;
        createRefreshToken: (payload: UserForRefreshTokenPayload) => Promise<string>;
    },
    logger: Logger,
) {
    return async function loginUser(
        email: string,
        password: string,
        accessTokenExpiresIn: number,
        refreshTokenExpiresIn: number,
    ): Promise<Result<LoginOutput, LoginUserErrorReasons>> {
        logger.log('Start login user', {
            email,
        });
        try {
            const user = await userRepository.getUserByEmail(email);

            if (!user) {
                logger.error('Failed to login user (user not found)', {
                    email,
                });
                return refuse(LoginUserErrorReasons.BAD_CREDENTIALS);
            }

            const passwordIsValid = await comparePassword(password, user.password);

            if (!passwordIsValid) {
                logger.error('Failed to login user', {
                    email,
                });
                return refuse(LoginUserErrorReasons.BAD_CREDENTIALS);
            }

            const userAccessTokenPayload: UserForAccessTokenPayload = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roleNames,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            const accessToken = await createAccessToken(userAccessTokenPayload);
            const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresIn * 1000);
            const userRefreshTokenPayload: UserForRefreshTokenPayload = {
                id: user.id,
                email: user.email,
            };
            const refreshToken = await createRefreshToken(userRefreshTokenPayload);
            const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresIn * 1000);

            await refreshTokenRepository.revokeAllActive(user.id);
            await refreshTokenRepository.create({
                token: refreshToken,
                userId: user.id,
                expiresAt: refreshTokenExpiresAt,
            });

            logger.log('User logged in', {
                email,
            });

            return succeed({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roleNames,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                token: {
                    accessToken,
                    accessTokenExpiresIn: accessTokenExpiresIn,
                    accessTokenExpiresAt,
                    refreshToken,
                    refreshTokenExpiresIn: refreshTokenExpiresIn,
                    refreshTokenExpiresAt,
                },
            });
        } catch (error) {
            logger.error('Failed to login user', {
                email,
                error: error.message,
            });

            return refuse(LoginUserErrorReasons.UNKNOW_ERROR);
        }
    };
}

function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
