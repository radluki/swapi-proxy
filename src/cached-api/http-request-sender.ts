import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpRequestSender {
  constructor(private httpService: HttpService) {}

  async get(url: string): Promise<string> {
    const response$ = this.httpService.get(url, {
      transformResponse: [(data) => data],
    });
    const response = await firstValueFrom(response$);
    return response.data;
  }
}
