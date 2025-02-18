import { Controller, Get, Inject, Post, Query, UsePipes } from '@nestjs/common';
import { AddressSuggestionService } from './address-suggestion/address-suggestion.service';
import {
  AddressSuggestionRequestDto,
  AddressSuggestionRequestSchema,
} from './address-suggestion/dto/address-suggestion-request.dto';
import { ZodValidationPipe } from './zod-validation.pipe';

@Controller()
export class AppController {
  constructor(
    @Inject(AddressSuggestionService)
    private readonly addressService: AddressSuggestionService) {}

  @Get('suggest')
  @UsePipes(new ZodValidationPipe(AddressSuggestionRequestSchema))
  async getAddress(@Query() query: AddressSuggestionRequestDto) {
    const updatedQuery = this.addCountryCodeToQuery(query);
    return this.addressService.suggestAddresses(updatedQuery);
  }

  // as we need only australian addresses so adding default countrycode
  private addCountryCodeToQuery(query: AddressSuggestionRequestDto): AddressSuggestionRequestDto {
    return { ...query, countryCode: 'AU' };
  }
}
