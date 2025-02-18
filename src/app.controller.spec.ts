import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AddressSuggestionService } from './address-suggestion/address-suggestion.service';
import { AddressSuggestionRequestDto } from './address-suggestion/dto/address-suggestion-request.dto';
import { AddressSuggestionResult } from './address-suggestion/interfaces/address-suggestion-result.interface';

describe('AppController', () => {
  let appController: AppController;
  let addressService: AddressSuggestionService;

  const mockAddressService = {
    suggestAddresses: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AddressSuggestionService,
          useValue: mockAddressService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    addressService = module.get<AddressSuggestionService>(AddressSuggestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getAddress', () => {
    it('should return address suggestions when service returns results', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Sydney',
        countryCode: '', // Will be overwritten to 'AU' in the controller
        limit: 5,
      };

      const mockResponse: AddressSuggestionResult[] = [
        {
          id: 'result1',
          address: '123 Test St, Sydney, Australia',
          streetName: 'Test St',
          country: 'Australia',
          municipality: 'Sydney',
          postalCode: '2000',
          latitude: -33.86882,
          longitude: 151.20929,
        },
      ];

      mockAddressService.suggestAddresses.mockResolvedValue(mockResponse);

      const result = await appController.getAddress(mockQuery);

      expect(addressService.suggestAddresses).toHaveBeenCalledWith({
        query: 'Sydney',
        countryCode: 'AU', // Confirm the overwrite
        limit: 5,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should modify the query to include hardcoded countryCode "AU"', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Melbourne',
        countryCode: '',
        limit: 10,
      };

      const mockResponse: AddressSuggestionResult[] = [];
      mockAddressService.suggestAddresses.mockResolvedValue(mockResponse); // Empty mock

      const result = await appController.getAddress(mockQuery);

      expect(addressService.suggestAddresses).toHaveBeenCalledWith({
        query: 'Melbourne',
        countryCode: 'AU', // Overwritten value
        limit: 10,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the service fails', async () => {
      const mockQuery: AddressSuggestionRequestDto = {
        query: 'Nonexistent',
        countryCode: '',
        limit: 5,
      };

      mockAddressService.suggestAddresses.mockRejectedValue(new Error('Service Error'));

      await expect(appController.getAddress(mockQuery)).rejects.toThrow('Service Error');

      expect(addressService.suggestAddresses).toHaveBeenCalledWith({
        query: 'Nonexistent',
        countryCode: 'AU', // Overwritten value
        limit: 5,
      });
    });
  });
});