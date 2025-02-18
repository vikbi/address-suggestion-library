import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AddressSuggestionProvider } from '../../interfaces/address-suggestion-provider.interface';
import { AddressSuggestionResult } from '../../interfaces/address-suggestion-result.interface';
import { firstValueFrom, timeout } from 'rxjs';
import { TomTomSearchResultDto, TomTomSearchResultSchema } from './dto/tomtom-search-result.dto';
import { AddressSuggestionRequestDto } from '../../dto/address-suggestion-request.dto';
import tomtomConfig from './tomtom.config';
import { z } from 'zod';

@Injectable()
export class TomTomService implements AddressSuggestionProvider {
  private readonly logger = new Logger(TomTomService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(tomtomConfig.KEY)
    private readonly config: ConfigType<typeof tomtomConfig>,
  ) {}

  async suggestAddresses(query: AddressSuggestionRequestDto): Promise<AddressSuggestionResult[]> {
    try {
      const { tomtomApiKey, baseUrl } = this.config;
      const {query: q, countryCode, limit} = query
      const searchText = encodeURIComponent(q);
      let url = `${baseUrl}/search/2/search/${searchText}.json?key=${tomtomApiKey}`;

      if (countryCode) {
        url += `&countrySet=${countryCode}`;
      }

      if (limit) {
        url += `&limit=${limit}`
      }
      const response = await firstValueFrom(this.httpService.get(url).pipe(timeout(3000)));

      if (!response?.data?.results) {
        throw new Error('Invalid api response structure');
      }

      const TomTomSearchResultsSchema = z.array(TomTomSearchResultSchema);
      const results = TomTomSearchResultsSchema.parse(response?.data?.results);

      // can apply filter to return only australian addresses,
      // but tomtom api supports countryset in request query to filter the return response

      return results
        //.filter(res => res.address.countryCode == 'AU')
        .map((result) => ({
          id: result.id,
          address: result.address.freeformAddress,
          streetName: result.address.streetName,
          country: result.address.country,
          municipality: result.address.municipality,
          postalCode: result.address.postalCode,
          latitude: result.position.lat,
          longitude: result.position.lon
      }));
    } catch (error) {
      this.logger.error('Error in TomTom API call', error.stack);
      if (error instanceof z.ZodError) {
        this.logger.error('TomTomResultSchema Validation Error', error.errors);
        throw new Error(`TomTomResultSchema Error: ${error.message}`);
      }
      throw new Error(`TomTom API Error: ${error.message}`);
    }
  }
}