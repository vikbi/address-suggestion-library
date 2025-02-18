import { Injectable, Inject } from '@nestjs/common';
import { AddressSuggestionProvider } from './interfaces/address-suggestion-provider.interface';
import { AddressSuggestionResult } from './interfaces/address-suggestion-result.interface';
import { TomTomService } from './providers/tomtom/tomtom.service';
import { AddressSuggestionRequestDto } from './dto/address-suggestion-request.dto';

//Another address provider will be added here
@Injectable()
export class AddressSuggestionService {
  constructor(
    @Inject(TomTomService) // Inject the specific provider instance
    private readonly tomtomService: AddressSuggestionProvider, // Using the interface
  ) {}

  /**
   * Suggests possible addresses based on the input query criteria.
   *
   * @param {AddressSuggestionRequestDto} query - The request object containing the address query criteria.
   * @return {Promise<AddressSuggestionResult[]>} A promise that resolves to an array of suggested address results.
   * NOTE : If we want to dynamically select another address service, then conditional statement will be added here
   * Also default provider can be configured from env/config
   */
  async suggestAddresses(query: AddressSuggestionRequestDto): Promise<AddressSuggestionResult[]> {
    return this.tomtomService.suggestAddresses(query);
  }
}