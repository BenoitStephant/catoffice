import { Query, Resolver } from '@nestjs/graphql';
import { Public } from 'modules/auth/guard';
import { HealthService } from './health.service';

@Resolver('health')
export class HealthResolver {
    constructor(private readonly healthService: HealthService) {}

    @Public()
    @Query(() => String)
    checkHealth(): Promise<string> {
        return this.healthService.checkHealth();
    }
}
