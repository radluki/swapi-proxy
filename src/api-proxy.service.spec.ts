import { ApiProxyService } from './api-proxy.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('ApiProxyService', () => {
    let sut: ApiProxyService;

    const api_url = "https://swapi.dev/api/";

    const key = "people/1/";

    type Person = {
        name: string;
        height: string;
        mass: string;
    };

    const value: Person = {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
    }

    beforeAll(async () => {
        sut = new ApiProxyService(api_url);

        mockedAxios.get.mockImplementation(url =>
            url === "https://swapi.dev/api/people/1/"
                ? Promise.resolve({ data: value })
                : Promise.reject(new Error('not found'))
        );
    });

    describe('get', () => {

        it('should return value when key exists', async () => {
            const result = await sut.get(key)
            expect(result).toBeDefined();
            expect(result.name).toBe(value.name);
            expect(result.height).toBe(value.height);
            expect(result.mass).toBe(value.mass);
        });

        it('should return null when redis throws an error', async () => {
            const result = await sut.get("unknown-endpoint")
            expect(result).toBeNull();
        });
    });
});
