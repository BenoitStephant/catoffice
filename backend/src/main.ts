import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CatofficeModule } from './catoffice.module';

async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter({});

    const corsOrigin = process.env.CORS_ORIGIN;
    if (!corsOrigin) {
        throw new Error('CORS_ORIGIN is not set');
    }

    fastifyAdapter.enableCors({
        allowedHeaders: corsOrigin,
    });

    const app = await NestFactory.create<NestFastifyApplication>(CatofficeModule, fastifyAdapter);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({}));

    const configService = app.get<ConfigService>(ConfigService);
    const port = configService.get<number>('PORT');

    const logger = app.get<Logger>(Logger);

    logger.log(`Listening on port ${port}`, 'Bootstrap');
    await app.listen({
        port,
    });
}
bootstrap();
