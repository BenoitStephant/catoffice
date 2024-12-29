import { Field, ObjectType } from '@nestjs/graphql';
import { UserWithoutRelations } from 'modules/admin/user/gql/output/user-without-relations.output.model';

@ObjectType()
export class Role {
    @Field(() => String)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    creatorId: string | null;

    @Field(() => UserWithoutRelations, { nullable: true })
    creator: UserWithoutRelations | null;

    @Field(() => String, { nullable: true })
    editorId: string | null;

    @Field(() => UserWithoutRelations, { nullable: true })
    editor: UserWithoutRelations | null;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}
