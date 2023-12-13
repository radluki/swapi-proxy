import { instance, mock, when, verify, anything, match } from 'ts-mockito';
import { ApiProxyService } from './api-proxy.service';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { RedisService } from './redis.service';


describe('CachedApiProxyService', () => {
    let sut: CachedApiProxyService;
    let apiProxyService: ApiProxyService;
    let redisService: RedisService;

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

    beforeEach(async () => {
        apiProxyService = mock<ApiProxyService>();
        redisService = mock<RedisService>();
        sut = new CachedApiProxyService(instance(apiProxyService), instance(redisService));
    });

    describe('get', () => {

        function expectPerson(resultStr: string) {

            const result = JSON.parse(resultStr);
            expect(result).toBeDefined();
            expect(result.name).toBe(value.name);
            expect(result.height).toBe(value.height);
            expect(result.mass).toBe(value.mass);

        }

        it('should not access api when cache available', async () => {
            when(redisService.get(key)).thenResolve(JSON.stringify(value));

            const resultStr = await sut.get(key)
            expectPerson(resultStr);

            verify(redisService.get(key)).once();
            verify(apiProxyService.get(anything())).never();
            verify(redisService.set(anything(), anything())).never();
        });

        it('should access api and set cache when cache returns null', async () => {
            when(redisService.get(key)).thenResolve(null);
            when(apiProxyService.get(key)).thenResolve(value);

            const resultStr = await sut.get(key)
            expectPerson(resultStr);

            verify(redisService.get(key)).once();
            verify(apiProxyService.get(key)).once();
            verify(redisService.set(key, resultStr)).once();
        });

        it('should not set cache when api returns null', async () => {
            when(redisService.get(key)).thenResolve(null);
            when(apiProxyService.get(key)).thenResolve(null);

            const result = await sut.get(key)
            expect(result).toBeNull();

            verify(redisService.get(key)).once();
            verify(apiProxyService.get(key)).once();
            verify(redisService.set(anything(), anything())).never();
        });

        it('should return null when api rejects', async () => {
            when(redisService.get(key)).thenResolve(null);
            when(apiProxyService.get(key)).thenReject(new Error("ERROR"));

            const result = await sut.get(key)
            expect(result).toBeNull();

            verify(redisService.get(key)).once();
            verify(apiProxyService.get(key)).once();
            verify(redisService.set(anything(), anything())).never();
        });

    });
});
