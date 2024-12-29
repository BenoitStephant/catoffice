export type RefreshToken = {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    isRevoked: boolean;
};

export type RefreshTokenCreateInput = Omit<RefreshToken, 'id' | 'isRevoked'>;
