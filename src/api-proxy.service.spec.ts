import { ApiProxyService } from './api-proxy.service';
import { HttpRequestSender } from './http-request-sender';
import { mock, instance, when, anything, verify } from 'ts-mockito';

describe('ApiProxyService', () => {
  let sut: ApiProxyService;
  let requestSenderMock: HttpRequestSender;

  const api_url = 'https://swapi.dev/api';
  const unknownEndpoint = '/unknown-endpoint';
  const relativeUrl = '/people/1/';
  const full_url = `${api_url}${relativeUrl}`;
  const value = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
  };
  const valueStr = JSON.stringify(value);

  beforeAll(async () => {
    requestSenderMock = mock<HttpRequestSender>();
    sut = new ApiProxyService(api_url, instance(requestSenderMock));
  });

  describe('get', () => {
    it('should return serialized value when axios api call returns resp.data', async () => {
      when(requestSenderMock.get(full_url)).thenResolve(value);
      const result = await sut.get(relativeUrl);
      expect(result).toBe(valueStr);
      verify(requestSenderMock.get(full_url)).once();
    });

    it('should return null when response undefined', async () => {
      when(requestSenderMock.get(anything())).thenResolve(undefined);
      const result = await sut.get(unknownEndpoint);
      expect(result).toBeNull();
      verify(requestSenderMock.get(`${api_url}${unknownEndpoint}`)).once();
    });

    it('should propagate sender exceptions', async () => {
      const err = { name: "err33", message: 'error12' };
      when(requestSenderMock.get(anything()))
        .thenReject(err);

      await expect(sut.get(unknownEndpoint)).rejects.toEqual(err);
    });
  });
});
