import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
    public async checkHealth(): Promise<string> {
        return 'OK';
    }
}
