import { Field, ObjectType } from '@nestjs/graphql';
import { RoleWithoutRelations } from 'modules/admin/role/model';
import { UserWithoutRelations } from './user-without-relations.output.model';

@ObjectType()
export class User {
    @Field(() => String)
    id: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    @Field(() => [RoleWithoutRelations])
    roles: RoleWithoutRelations[];

    @Field(() => String, { nullable: true })
    creatorId: string | null;

    @Field(() => UserWithoutRelations, { nullable: true })
    creator: UserWithoutRelations | null;

    @Field(() => String, { nullable: true })
    editorId: string | null;

    @Field(() => UserWithoutRelations, { nullable: true })
    editor: UserWithoutRelations | null;

    @Field(() => Date, { nullable: true })
    archivedAt: Date | null;

    @Field(() => String, { nullable: true })
    archiverId: string | null;

    @Field(() => UserWithoutRelations, { nullable: true })
    archiver: UserWithoutRelations | null;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}
