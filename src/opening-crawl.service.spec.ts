import { OpeningCrawlService } from './opening-crawl.service';
import { HttpRequestSender } from './http-request-sender';
import { mock, instance, when } from 'ts-mockito';

describe('OpeningCrawlService', () => {

    let sut: OpeningCrawlService;
    let httpRequestSenderMock: HttpRequestSender;

    const filmsUrl = "http://localhost:3000/api/films/";

    beforeEach(async () => {
        httpRequestSenderMock = mock<HttpRequestSender>();
        sut = new OpeningCrawlService(
            instance(httpRequestSenderMock)
        );
    });

    it('countWords', async () => {
        when(httpRequestSenderMock.get(filmsUrl)).thenResolve({
            results: [
                { opening_crawl: " one,.,. !@two,!     R2-D2\nthree...." },
                { opening_crawl: "\none\r\ntwo    three,\rthree!\nthree\n" }
            ]
        });
        
        const serializedObj = await sut.countWords();
        const obj = JSON.parse(serializedObj);

        expect(obj).toEqual({
            one: 2,
            two: 2,
            three: 4,
            r2d2: 1
        });
    });
});