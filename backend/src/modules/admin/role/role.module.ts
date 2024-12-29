import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserModule } from '../user';
import { RoleRepository } from './repository';
import { RoleService } from './role.service';

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [RoleService, PrismaService, RoleRepository],
    exports: [RoleService, RoleRepository],
})
export class RoleModule {}
