import { UserWithoutRelationsAndArchived } from 'modules/admin/user/type';

type Token = {
    accessToken: string;
    accessTokenExpiresIn: number;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresIn: number;
    refreshTokenExpiresAt: Date;
};

export type LoginOutput = UserWithoutRelationsAndArchived & {
    roles: string[];
    token: Token;
};

export type RefreshAccessTokenLoginOutput = Token;
