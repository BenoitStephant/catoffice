import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { configValidationSchema } from './config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { GqlAuthGuard } from './modules/auth/guard/gql-auth.guard';
import { HealthModule } from './modules/health';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: configValidationSchema,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'schema.gql'),
            sortSchema: true,
        }),

        HealthModule,

        AdminModule,
        AuthModule,
    ],
    providers: [
        Logger,
        JwtService,
        {
            provide: APP_GUARD,
            useClass: GqlAuthGuard,
        },
    ],
})
export class CatofficeModule {}
