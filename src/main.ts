import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from './utils/esception.filter';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { getNestLogLevels } from './utils/nest-log-levels';
import { ConfigService } from '@nestjs/config';
import { PORT } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getNestLogLevels(process.env.LOG_LEVEL),
  });
  app.useGlobalFilters(new AnyExceptionFilter());

  setUpSwagger(app);

  const port = app.get(ConfigService).get(PORT);
  await app.listen(port);
}

function setUpSwagger(app: any): void {
  const swaggerDocument = YAML.load('./swagger-config.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

bootstrap();
