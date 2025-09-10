import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export function createMongooseConfig(configService: ConfigService): MongooseModuleOptions {
  return {
    uri: configService.get('MONGODB_URI'),
  };
}
