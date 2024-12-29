import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserWithoutRelations {
    @Field(() => String)
    id: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}
