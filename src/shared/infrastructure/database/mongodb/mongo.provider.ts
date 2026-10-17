import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

export const MONGO_DB=Symbol('MONGO_DB');

export const MongoProvider = {
    provide: MONGO_DB,
    useFactory: async (configService: ConfigService) : Promise<Db> => {
      const uri=configService.getOrThrow<string>('MONGO_URL');
      const client = new MongoClient(uri);
      await client.connect();
      const dbName=configService.get<string>('MONGO_DB_NAME','e-commerce');
      return client.db(dbName);
    },
    inject: [ConfigService  ],

}
