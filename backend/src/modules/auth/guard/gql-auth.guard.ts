import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.guard';

@Injectable()
export class GqlAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const ctx = GqlExecutionContext.create(context);
        const tokenWithBearer = ctx.getContext().req.headers?.authorization;

        if (!tokenWithBearer) {
            throw new UnauthorizedException();
        }

        const token = tokenWithBearer?.split(' ')[1];
        const jwtAccessTokenSecret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
        const user = this.jwtService.verify(token, { secret: jwtAccessTokenSecret });

        if (!user) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
