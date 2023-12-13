import { Injectable, Logger } from '@nestjs/common';
import { ApiProxyService } from './api-proxy.service';
import { RedisService } from './redis.service';


@Injectable()
export class CachedApiProxyService {
    private readonly logger = new Logger(CachedApiProxyService.name);

    constructor(
        private readonly apiProxyService: ApiProxyService,
        private readonly redisService: RedisService) { }

    async get(relativeUrl: string): Promise<string | null> {
        return await this.getFromCache(relativeUrl) || this.getFromApi(relativeUrl);
    }

    private async getFromCache(key: string): Promise<string | null> {
        try {
            const cachedValue = await this.redisService.get(key);
            if (cachedValue) {
                this.logger.log(`Cache hit for key "${key}"`);
                return cachedValue;
            }
            this.logger.log(`Cache miss for key "${key}"`);
        } catch (err) {
            this.logger.warn(`Exception during cache check: ${err.message}`);
        }
        return null;
    }

    private async getFromApi(relativeUrl: string): Promise<string | null> {
        try {
            this.logger.log(`Fetching data directly from api for key "${relativeUrl}"`);
            const responseDataStr = await this.apiProxyService.get(relativeUrl);
            responseDataStr && this.redisService.set(relativeUrl, responseDataStr);
            return responseDataStr;
        } catch (error) {
            this.logger.error(`Error fetching data: ${error.message}`);
        }
        return null;
    }
}