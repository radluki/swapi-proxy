import { OpeningCrawlService } from './opening-crawl.service';
import { HttpRequestSender } from './http-request-sender';
import { mock, instance, when } from 'ts-mockito';

describe('OpeningCrawlService', () => {

    let sut: OpeningCrawlService;
    let httpRequestSenderMock: HttpRequestSender;

    const filmsUrl = "http://localhost:3000/api/films/";
    const peopleUrl = "http://localhost:3000/api/people/";

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

    it('getNamesWithTheMostOccurences', async () => {
        when(httpRequestSenderMock.get(peopleUrl)).thenResolve({
            next: "https://swapi.dev/api/people/?page=2",
            results: [
                { name: "Luke Skywalker" },
                { name: "Leia Morgana" },
            ]
        });
        when(httpRequestSenderMock.get("http://localhost:3000/api/people/?page=2")).thenResolve({
            next: null,
            results: [
                { name: "Dooku" },
                { name: "Han Solo" },
            ]
        });
        when(httpRequestSenderMock.get(filmsUrl)).thenResolve({
            results: [
                { opening_crawl: " Luke\r\nSkYwalker, Luke, Dooku, " },
                { opening_crawl: "\none\r\ntwo Luke Han  Han Solo Dooku Luke  skywalker ree\n" }
            ]
        });

        const serializedObj = await sut.getNamesWithTheMostOccurences();
        const obj = JSON.parse(serializedObj);
        expect(obj.sort()).toEqual(["luke skywalker", "dooku"].sort());
    });
});