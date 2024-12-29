import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { isRefusal, isSuccess } from 'libs/operation-result';
import { AuthService } from './auth.service';
import { Public } from './guard/public.guard';
import { Login } from './model/output';
import { LoginUserErrorReasons } from './usecase';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => Login)
    @Public()
    async login(
        @Args('email', { type: () => String }) email: string,
        @Args('password', { type: () => String }) password: string,
    ) {
        const result = await this.authService.login(email, password);

        if (isRefusal(result)) {
            if (result.reason === LoginUserErrorReasons.BAD_CREDENTIALS) {
                throw new UnauthorizedException(result.reason);
            }
            if (result.reason === LoginUserErrorReasons.UNKNOW_ERROR) {
                throw new UnauthorizedException(result.reason);
            }
        }
        if (!isSuccess(result)) {
            throw new UnauthorizedException(LoginUserErrorReasons.UNKNOW_ERROR);
        }

        return result.data;
    }
}
