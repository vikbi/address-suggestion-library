import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { TomTomService } from './tomtom.service';
import { of, throwError } from 'rxjs';
import { ConfigType } from '@nestjs/config';
import tomtomConfig from './tomtom.config';
import { AddressSuggestionRequestDto } from '../../dto/address-suggestion-request.dto';

describe('TomTomService', () => {
  let service: TomTomService;
  let httpService: HttpService;

  const mockConfig: ConfigType<typeof tomtomConfig> = {
    tomtomApiKey: 'mockApiKey',
    baseUrl: 'https://api.tomtom.com',
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TomTomService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: tomtomConfig.KEY,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<TomTomService>(TomTomService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('suggestAddresses', () => {
    it('should return address suggestions from TomTom API', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Sydney'
      };

      const mockApiResponse = {
        data: {
          results: [
            {
              id: 'id1',
              address: {
                freeformAddress: '123 Test St, Sydney, Australia',
                streetName: 'Test St',
                country: 'Australia',
                countryCode: 'AU',
                municipality: 'Sydney',
                postalCode: '2000',
                countrySubdivisionName: 'Sydney'
              },
              position: {
                lat: -33.86882,
                lon: 151.20929,
              },
            },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      const result = await service.suggestAddresses(mockQuery);

      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining(
          `${mockConfig.baseUrl}/search/2/search/Sydney.json`
        )
      );
      expect(result).toEqual([
        {
          id: 'id1',
          address: '123 Test St, Sydney, Australia',
          streetName: 'Test St',
          country: 'Australia',
          municipality: 'Sydney',
          postalCode: '2000',
          latitude: -33.86882,
          longitude: 151.20929,
        },
      ]);
    });

    it('should handle API errors and throw an appropriate error', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Melbourne',
        limit: 5,
      };

      mockHttpService.get.mockReturnValue(throwError(() => new Error('API Error')));

      await expect(service.suggestAddresses(mockQuery)).rejects.toThrow(
        'TomTom API Error: API Error'
      );

      expect(httpService.get).toHaveBeenCalled();
    });

    it('should include countryCode and limit in the request URL if provided', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Brisbane',
        countryCode: 'AU',
        limit: 10,
      };

      const mockApiResponse = { data: { results: [] } };
      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      await service.suggestAddresses(mockQuery);

      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringMatching(
          /search\/2\/search\/Brisbane\.json\?key=mockApiKey&countrySet=AU&limit=10/
        )
      );
    });

    it('should handle an empty results array from the API gracefully', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Nonexistent Place'
      };

      const mockApiResponse = { data: { results: [] } };
      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      const result = await service.suggestAddresses(mockQuery);

      expect(result).toEqual([]);
    });
  });
});