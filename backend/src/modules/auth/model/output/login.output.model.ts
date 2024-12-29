import { Field, ObjectType } from '@nestjs/graphql';
import { UserWithoutRelations } from 'modules/admin/user/gql/output';
import { Token } from './token.output.model';

@ObjectType()
export class Login extends UserWithoutRelations {
    @Field(() => [String])
    roles: string[];

    @Field(() => Token)
    token: Token;
}
