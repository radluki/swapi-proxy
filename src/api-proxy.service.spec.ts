import { ApiProxyService } from './api-proxy.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiProxyService', () => {
  let sut: ApiProxyService;

  const api_url = 'https://swapi.dev/api';
  const relativeUrl = '/people/1/';
  const value = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
  };
  const valueStr = JSON.stringify(value);

  beforeAll(async () => {
    sut = new ApiProxyService(api_url);

    mockedAxios.get.mockImplementation((url) =>
      url === 'https://swapi.dev/api/people/1/'
        ? Promise.resolve({ data: value })
        : Promise.reject(new Error('not found')),
    );
  });

  describe('get', () => {
    it('should return serialized value when axios api call returns resp.data', async () => {
      const result = await sut.get(relativeUrl);
      expect(result).toBe(valueStr);
    });

    it('should return null when axios rejects', async () => {
      const result = await sut.get('unknown-endpoint');
      expect(result).toBeNull();
    });

    it('should return null when response.data is undefined', async () => {
      mockedAxios.get.mockResolvedValueOnce({});
      const result = await sut.get(relativeUrl);
      expect(result).toBeNull();
    });
  });
});
