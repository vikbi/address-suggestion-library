import { AddressSuggestionResult } from './address-suggestion-result.interface';
import { AddressSuggestionRequestDto } from '../dto/address-suggestion-request.dto';

export interface AddressSuggestionProvider {
  suggestAddresses(
    query: AddressSuggestionRequestDto,
  ): Promise<AddressSuggestionResult[]>;
}