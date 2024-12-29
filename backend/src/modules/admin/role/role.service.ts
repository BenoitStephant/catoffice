import { Injectable } from '@nestjs/common';
import { RoleRepository } from './repository';
import { buildGetRolesForUserId } from './usecase';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepostiory: RoleRepository) {}

    getRolesForUserId(userId: string) {
        const getRolesForUserid = buildGetRolesForUserId({
            roleRepository: this.roleRepostiory,
        });

        return getRolesForUserid(userId);
    }
}
