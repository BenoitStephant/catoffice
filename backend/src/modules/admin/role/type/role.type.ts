export type Role = {
    id: string;

    name: string;

    creatorId: string;
    editorId: string;

    createdAt: Date;
    updatedAt: Date;
};

export type RoleWithoutRelations = Omit<Role, 'creatorId' | 'editorId'>;
