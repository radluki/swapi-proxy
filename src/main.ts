import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from './esception.filter';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AnyExceptionFilter());

  setUpSwagger(app);

  await app.listen(3000);
}

function setUpSwagger(app: any): void {
  const swaggerDocument = YAML.load('./src/swagger-config.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

bootstrap();
