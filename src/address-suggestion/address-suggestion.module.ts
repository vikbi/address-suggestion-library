import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AddressSuggestionService } from './address-suggestion.service';
import { TomTomService } from './providers/tomtom/tomtom.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import tomtomConfig from './providers/tomtom/tomtom.config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(tomtomConfig),
  ],
  providers: [AddressSuggestionService, TomTomService],
  exports: [AddressSuggestionService],
})
export class AddressSuggestionModule {}