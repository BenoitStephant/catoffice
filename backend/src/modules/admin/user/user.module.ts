import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RoleModule } from '../role';
import { UserRepository } from './repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [forwardRef(() => RoleModule)],
    providers: [ConfigService, UserResolver, UserService, PrismaService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
