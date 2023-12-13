import { Injectable, Logger, Inject } from '@nestjs/common';
import axios from 'axios';


@Injectable()
export class ApiProxyService {
    private readonly logger = new Logger(ApiProxyService.name);

    constructor(@Inject('API_URL') private readonly apiUrl: string) { }

    async get(relativeUrl: string): Promise<any | null> {
        try {
            const fullUrl = `${this.apiUrl}${relativeUrl}`;
            this.logger.log(`Fetching data from url: ${fullUrl}`);
            const response = await axios.get(`${fullUrl}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Error fetching data: ${error.message}`);
            return null;
        }
    }
}
