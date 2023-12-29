import { Article, Author } from './types/AuthorNest';
import { Resolver, Query, ResolveField, Args, Parent } from '@nestjs/graphql';
import { AuthorService } from './author.service';

@Resolver((of) => Author)
export class AuthorResolver {
  constructor(private authorService: AuthorService) {}

  @Query((returns) => Author)
  async author(@Args('id') id: number) {
    return this.authorService.findOneById(id.toString());
  }

  @ResolveField('articles', (returns) => [Article])
  async getArticles(@Parent() author: Author) {
    const { id } = author;
    return this.authorService.findArticlesByAuthorId(id);
  }
}
