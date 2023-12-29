import { Article, Author } from './types/AuthorNest';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  async findOneById(id: string): Promise<Article> {
    return {
      id,
      title: 'Super Artykuł - ArticleService.findOneById',
      content: 'First line.\nSecond Line.',
    };
  }

  async findAuthorsByArticleId(articleId: string): Promise<Author[]> {
    return [
      {
        id: '12',
        name: 'Harry Potter - ArticleService.findAuthorsByArticleId',
      },
    ];
  }
}
