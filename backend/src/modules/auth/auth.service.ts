import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'modules/admin/user/repository';
import { RefreshTokenRepository } from './repositories';
import { buildLoginUser } from './usecase';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) {}

    login(email: string, password: string) {
        const jwtAccessTokenExpiresIn = this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN');
        const jwtRefreshTokenExpiresIn = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRES_IN');
        const jwtAccessTokenSecret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
        const jwtRefreshTokenSecret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');

        const loginUser = buildLoginUser(
            {
                userRepository: this.userRepository,
                refreshTokenRepository: this.refreshTokenRepository,

                createAccessToken: async (payload: any) =>
                    this.jwtService.signAsync(payload, {
                        expiresIn: jwtAccessTokenExpiresIn,
                        secret: jwtAccessTokenSecret,
                    }),
                createRefreshToken: async (payload: any) =>
                    this.jwtService.signAsync(payload, {
                        expiresIn: jwtRefreshTokenExpiresIn,
                        secret: jwtRefreshTokenSecret,
                    }),
            },
            this.logger,
        );

        return loginUser(email, password, jwtAccessTokenExpiresIn, jwtRefreshTokenExpiresIn);
    }
}
