import { Module } from '@nestjs/common';
import { CachedApiModule } from './cached-api/cached-api.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ConfigModule } from '@nestjs/config';
import configuration, {
  envVariablesValidationSchema,
} from './config/configuration';

@Module({
  imports: [
    CachedApiModule,
    GraphqlModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envVariablesValidationSchema,
    }),
  ],
  providers: [],
})
export class AppModule {}
