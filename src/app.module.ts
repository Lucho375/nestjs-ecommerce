import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HashService } from './hash/hash.service';
import { HashModule } from './hash/hash.module';

@Module({
  controllers: [AppController],
  providers: [AppService, HashService],
  imports: [
    ProductsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestjs-ecommerce'),
    HashModule,
  ],
})
export class AppModule {}
