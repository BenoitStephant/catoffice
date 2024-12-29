export type User = {
    id: string;

    email: string;

    firstName: string;
    lastName: string;

    roleIds: string[];

    creatorId: string;
    editorId: string;

    archivedAt: Date;
    archiverId: string;

    createdAt: Date;
    updatedAt: Date;
};

export type UserWithoutRelations = Omit<User, 'creatorId' | 'editorId' | 'roleIds' | 'archiverId'>;

export type UserWithoutRelationsAndArchived = Omit<
    User,
    'creatorId' | 'editorId' | 'roleIds' | 'archiverId' | 'isArchived' | 'archivedAt'
>;

export type UserForLogin = UserWithoutRelationsAndArchived & {
    password: string;
    roleNames: string[];
};

export type UserCreateInput = Omit<
    User,
    'id' | 'creatorId' | 'editorId' | 'createdAt' | 'updatedAt' | 'isArchived' | 'archivedAt' | 'archiverId'
> & {
    password: string;
};

export type UserUpdateInput = Omit<
    User,
    'id' | 'creatorId' | 'editorId' | 'createdAt' | 'updatedAt' | 'isArchived' | 'archivedAt' | 'archiverId'
>;

export type UserForAccessTokenPayload = UserWithoutRelationsAndArchived & {
    roles: string[];
};

export type UserForRefreshTokenPayload = Pick<User, 'id' | 'email'>;
