import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from './utils/esception.filter';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { getNestLogLevels } from './utils/nest-logger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getNestLogLevels(process.env.LOG_LEVEL),
  });
  app.useGlobalFilters(new AnyExceptionFilter());

  setUpSwagger(app);

  await app.listen(3000);
}

function setUpSwagger(app: any): void {
  const swaggerDocument = YAML.load('./src/swagger-config.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

bootstrap();
