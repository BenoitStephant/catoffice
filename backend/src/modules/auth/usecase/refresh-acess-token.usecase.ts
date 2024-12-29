import { Logger } from '@nestjs/common';
import { refuse, Result, succeed } from 'libs/operation-result';
import { UserForAccessTokenPayload, UserForLogin } from 'modules/admin/user/type';
import { RefreshAccessTokenLoginOutput, RefreshToken, RefreshTokenCreateInput } from '../type';

export interface RefreshTokenRepository {
    isActive(token: string): Promise<boolean>;
    revoke(token: string): Promise<void>;
    create(input: RefreshTokenCreateInput): Promise<RefreshToken>;
}

export interface UserRefreshAccessTokenRepository {
    getUserByEmail(email: string): Promise<UserForLogin | null>;
}

export enum RefreshTokenErrors {
    REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
    FAILED_TO_DECODE_REFRESH_TOKEN = 'FAILED_TO_DECODE_REFRESH_TOKEN',
    REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
    REFRESH_TOKEN_REVOKED = 'REFRESH_TOKEN_REVOKED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    UNKNOW_ERROR = 'UNKNOW_ERROR',
}

export function buildRefreshAccessToken(
    {
        refreshTokenRepository,
        userRepository,

        getPayloadFromRefreshToken,
        createAccessToken,
        createRefreshToken,
    }: {
        refreshTokenRepository: RefreshTokenRepository;
        userRepository: UserRefreshAccessTokenRepository;

        getPayloadFromRefreshToken: (token: string) => Promise<any>;
        createAccessToken: (payload: any) => Promise<string>;
        createRefreshToken: (payload: any) => Promise<string>;
    },
    logger: Logger,
) {
    return async function refreshAccessToken(
        token: string,
        accessTokenExpiresIn: number,
        refreshTokenExpiresIn: number,
    ): Promise<Result<RefreshAccessTokenLoginOutput, RefreshTokenErrors>> {
        try {
            logger.log('Start refresh access token', { token });

            const isActive = await refreshTokenRepository.isActive(token);
            if (!isActive) {
                logger.error('Failed to refresh access token', {
                    token,
                    reason: RefreshTokenErrors.REFRESH_TOKEN_NOT_FOUND,
                });
                return refuse(RefreshTokenErrors.REFRESH_TOKEN_REVOKED);
            }

            const refreshTokenPayload = await getPayloadFromRefreshToken(token);
            if (!refreshTokenPayload) {
                logger.error('Failed to refresh access token', {
                    token,
                    reason: RefreshTokenErrors.FAILED_TO_DECODE_REFRESH_TOKEN,
                });
                return refuse(RefreshTokenErrors.FAILED_TO_DECODE_REFRESH_TOKEN);
            }

            const user = await userRepository.getUserByEmail(refreshTokenPayload.email);
            if (!user) {
                logger.error('Failed to refresh access token', { token, reason: RefreshTokenErrors.USER_NOT_FOUND });
                return refuse(RefreshTokenErrors.USER_NOT_FOUND);
            }

            await refreshTokenRepository.revoke(token);

            const accessTokenPayload: UserForAccessTokenPayload = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roleNames,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            const accessToken = await createAccessToken(accessTokenPayload);
            const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresIn * 1000);
            const refreshToken = await createRefreshToken(refreshTokenPayload);
            const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresIn * 1000);

            await refreshTokenRepository.create({
                token: refreshToken,
                userId: user.id,
                expiresAt: refreshTokenExpiresAt,
            });

            logger.log('Refresh access token', { token, accessToken, accessTokenExpiresAt });

            return succeed({
                accessToken,
                accessTokenExpiresIn,
                accessTokenExpiresAt,
                refreshToken,
                refreshTokenExpiresIn,
                refreshTokenExpiresAt,
            });
        } catch (error) {
            logger.error('Failed to refresh access token', { token, error });
            return refuse(RefreshTokenErrors.UNKNOW_ERROR);
        }
    };
}
