import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import { readCookie, setCookie } from '../../libs/cookie';
import { User } from '../../types/user';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './storage-key.constant';

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
}

const initialState: AuthState = (() => {
    const accessToken = readCookie(ACCESS_TOKEN_STORAGE_KEY) || '';
    const refreshToken = readCookie(REFRESH_TOKEN_STORAGE_KEY) || '';
    const user = (accessToken ? jwtDecode(accessToken) : null) as User | null;

    return {
        isAuthenticated: !!accessToken,
        accessToken,
        refreshToken,
        user,
    };
})();

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{
                accessToken: string;
                accessTokenExpiresAt: Date;
                refreshToken: string;
                refreshTokenExpiresAt: Date;
                user: User;
            }>,
        ) => {
            const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, user } = action.payload;

            state.isAuthenticated = true;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.user = user;

            setCookie(ACCESS_TOKEN_STORAGE_KEY, accessToken, accessTokenExpiresAt);
            setCookie(REFRESH_TOKEN_STORAGE_KEY, refreshToken, refreshTokenExpiresAt);
            setCookie(USER_STORAGE_KEY, JSON.stringify(user), accessTokenExpiresAt);
        },
    },
});

export const { login } = auth.actions;

export default auth.reducer;
