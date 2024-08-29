import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './hash/hash.module';
import { HashService } from './hash/hash.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
@Module({
  controllers: [AppController],
  providers: [AppService, HashService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return { uri: config.get<string>('DB_URI') };
      },
    }),
    AuthModule,
    HashModule,
    UsersModule,
  ],
})
export class AppModule {}
