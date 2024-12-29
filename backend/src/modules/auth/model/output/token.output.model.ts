import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
    @Field(() => String)
    accessToken: string;

    @Field(() => Number)
    accessTokenExpiresIn: number;

    @Field(() => Date)
    accessTokenExpiresAt: Date;

    @Field(() => String)
    refreshToken: string;

    @Field(() => Number)
    refreshTokenExpiresIn: number;

    @Field(() => Date)
    refreshTokenExpiresAt: Date;
}
