import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema, loadConfig } from './config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
      validationSchema,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
    }),
  ],
  providers: [],
})
export class ConfigModule {}
