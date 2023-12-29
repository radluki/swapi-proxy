import { Injectable } from '@nestjs/common';
import { Article, Author } from './types/AuthorNest';

@Injectable()
export class AuthorService {
  async findOneById(id: string): Promise<Author> {
    return {
      id,
      name: 'John Potter - AuthorService.findOneById',
    };
  }

  async findArticlesByAuthorId(authorId: string): Promise<Article[]> {
    return [
      {
        id: '100',
        title: 'Super Artykuł - AuthorService.findArticlesByAuthorId',
        content: 'First line.\nSecond Line.',
      },
    ];
  }
}
