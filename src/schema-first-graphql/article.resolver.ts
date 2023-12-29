import { Author, Article } from './types/AuthorNest';
import { Resolver, Query, ResolveField, Args, Parent } from '@nestjs/graphql';
import { ArticleService } from './article.service';

@Resolver((of) => Article)
export class ArticleResolver {
  constructor(private articleService: ArticleService) {}

  @Query((returns) => Article)
  async article(@Args('id') id: number) {
    return this.articleService.findOneById(id.toString());
  }

  @ResolveField('authors', (returns) => [Author])
  async getAuthors(@Parent() article: Article) {
    const { id } = article;
    return this.articleService.findAuthorsByArticleId(id);
  }
}
