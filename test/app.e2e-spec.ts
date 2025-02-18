import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AddressSuggestionService } from '../src/address-suggestion/address-suggestion.service';

// Mock data to simulate the service behavior
const mockAddressService = {
  suggestAddresses: jest.fn(),
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule], // Import the actual AppModule
    })
      .overrideProvider(AddressSuggestionService) // Override the real service with the mock
      .useValue(mockAddressService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return address suggestions for a valid query', async () => {
    // Mock the service to return specific address results
    mockAddressService.suggestAddresses.mockResolvedValue([
      {
        id: 'id1',
        address: '123 Test St, Sydney, Australia',
        streetName: 'Test St',
        country: 'Australia',
        municipality: 'Sydney',
        postalCode: '2000',
        latitude: -33.8688,
        longitude: 151.2093,
      },
    ]);

    const req = {
      query: 'Sydney'
    };

    return request(app.getHttpServer())
      .get('/suggest')
      .query(req)
      .expect(200)
      .expect([
        {
          id: 'id1',
          address: '123 Test St, Sydney, Australia',
          streetName: 'Test St',
          country: 'Australia',
          municipality: 'Sydney',
          postalCode: '2000',
          latitude: -33.8688,
          longitude: 151.2093,
        },
      ]);
  });

  it('should apply default countryCode to query', async () => {
    mockAddressService.suggestAddresses.mockResolvedValue([]);

    const query = {
      query: 'Melbourne',
    };

    await request(app.getHttpServer())
      .get('/suggest')
      .query(query)
      .expect(200)
      .expect([]);

    expect(mockAddressService.suggestAddresses).toHaveBeenCalledWith({
      query: 'Melbourne',
      countryCode: 'AU', // Ensure default 'AU' is applied internally
    });
  });

  it('should return 500 if the service throws an internal error', async () => {
    mockAddressService.suggestAddresses.mockRejectedValue(new Error('Service Error'));

    const query = {
      query: 'Invalid',
    };

    return request(app.getHttpServer())
      .get('/suggest')
      .query(query)
      .expect(500)
      .expect({
        statusCode: 500,
        message: 'Internal server error',
      });
  });
});