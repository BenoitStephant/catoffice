import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../../constant';

@InputType()
export class UserCreateInput {
    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String)
    @MinLength(MIN_PASSWORD_LENGTH)
    @MaxLength(MAX_PASSWORD_LENGTH)
    password: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @Field(() => [String])
    @IsUUID('4', { each: true })
    roleIds: string[];
}
