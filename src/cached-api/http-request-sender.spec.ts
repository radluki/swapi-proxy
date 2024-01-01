import { HttpService } from '@nestjs/axios';
import { HttpRequestSender } from './http-request-sender';
import { of, throwError } from 'rxjs';
import * as express from 'express';
import { Request, Response } from 'express';
import { Server } from 'http';
import * as portfinder from 'portfinder';

describe('HttpRequestSender', () => {
  describe('mocked httpService', () => {
    let sut: HttpRequestSender;
    const httpService = {
      get: jest.fn(),
    };

    const URL = 'http://example.com';
    const data = { field: 'data' };
    const dataStr = JSON.stringify(data);
    const mockResponse = {
      data: dataStr,
    };

    beforeEach(() => {
      sut = new HttpRequestSender(<any>httpService);
    });

    const getMockWithArgsVerification = (url, config) => {
      if (url !== URL) {
        throw new Error('wrong url');
      }
      if (!config || config.transformResponse[0](dataStr) !== dataStr) {
        throw new Error('wrong data transformer');
      }
      return of(mockResponse);
    };

    it('should return unparsed data', async () => {
      httpService.get.mockImplementation(getMockWithArgsVerification);

      const result = await sut.get(URL);
      expect(result).toBe(dataStr);
    });

    it('should propagate error when hhpService throws', async () => {
      const error = new Error('error');
      httpService.get.mockImplementation(() => {
        throw error;
      });

      await expect(sut.get(URL)).rejects.toThrow('error');
    });

    it('should propagate error when hhpService returns error observable', async () => {
      const error = new Error('error');
      httpService.get.mockImplementation(() => throwError(() => error));

      await expect(sut.get(URL)).rejects.toThrow('error');
    });
  });

  describe('real httpService + express js test server', () => {
    let sut: HttpRequestSender;
    const httpService = new HttpService();
    let server: Server;
    let port;

    function getUrl() {
      return `http://localhost:${port}/test`;
    }
    const body = {
      field1: 'data1',
      field2: 'data2',
    };

    const createServer = async () => {
      const app = express();

      app.get('/test', (req: Request, res: Response) => {
        res.send(body);
      });

      port = await portfinder.getPortPromise();

      return app.listen(port);
    };

    beforeAll(async () => {
      server = await createServer();
    });

    afterAll(() => {
      server.close();
    });

    beforeEach(() => {
      sut = new HttpRequestSender(httpService);
    });

    it('should return unparsed data', async () => {
      const result = await sut.get(getUrl());
      expect(result).toBe(JSON.stringify(body));
    });

    it('should propagate error', async () => {
      await expect(sut.get(getUrl() + '/invalid/')).rejects.toThrow(
        'Request failed with status code 404',
      );
    });
  });
});
