import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { AddressSuggestionModule } from './address-suggestion/address-suggestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    AddressSuggestionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
