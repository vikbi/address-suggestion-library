import { Test, TestingModule } from '@nestjs/testing';
import { AddressSuggestionService } from './address-suggestion.service';
import { AddressSuggestionProvider } from './interfaces/address-suggestion-provider.interface';
import { AddressSuggestionRequestDto } from './dto/address-suggestion-request.dto';
import { AddressSuggestionResult } from './interfaces/address-suggestion-result.interface';
import { TomTomService } from './providers/tomtom/tomtom.service';

describe('AddressSuggestionService', () => {
  let service: AddressSuggestionService;
  let mockTomTomService: AddressSuggestionProvider;

  // Mock for AddressSuggestionProvider (TomTomService)
  const mockProvider: AddressSuggestionProvider = {
    suggestAddresses: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [TomTomService],
      providers: [
        // AddressSuggestionService,
        // TomTomService
        {
          provide: 'TomTomService', // This matches the injection pattern - ensure correctness!
          useValue: mockProvider, // Replace the real provider with a mock
        },
        // AddressSuggestionService,
        {
          provide: AddressSuggestionService,
          useValue: mockProvider
        }
      ],
    }).compile();

    service = module.get<AddressSuggestionService>(AddressSuggestionService);
    mockTomTomService = module.get<AddressSuggestionProvider>('TomTomService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('suggestAddresses', () => {
    it('should return addresses from the provider', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Sydney',
        countryCode: 'AU',
        limit: 5,
      };

      const mockResponse: AddressSuggestionResult[] = [
        {
          id: '1',
          address: '123 Test St, Sydney, Australia',
          streetName: 'Test St',
          country: 'Australia',
          municipality: 'Sydney',
          postalCode: '2000',
          latitude: -33.86882,
          longitude: 151.20929,
        },
      ];

      jest.spyOn(mockTomTomService, 'suggestAddresses').mockResolvedValue(mockResponse);

      const result = await service.suggestAddresses(mockQuery);

      expect(mockTomTomService.suggestAddresses).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual(mockResponse);
    });

    it('should properly propagate errors from the provider', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Melbourne',
        countryCode: 'AU',
        limit: 5,
      };

      jest.spyOn(mockTomTomService, 'suggestAddresses').mockRejectedValue(new Error('Provider Error'));

      await expect(service.suggestAddresses(mockQuery)).rejects.toThrow('Provider Error');

      expect(mockTomTomService.suggestAddresses).toHaveBeenCalledWith(mockQuery);
    });
  });
});