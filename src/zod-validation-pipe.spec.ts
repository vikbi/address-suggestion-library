import { BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { ZodValidationPipe } from './zod-validation.pipe';
import { z, ZodObject } from 'zod';

describe('TEST : ZodValidationPipe', () => {
  let pipe: ZodValidationPipe;
  let mockSchema: ZodObject<any>;

  beforeEach(() => {
    // Example schema used for most tests
    mockSchema = z.object({
      query: z.string().min(1),
      countryCode: z.string().optional(),
      limit: z.number().optional()
    });
    pipe = new ZodValidationPipe(mockSchema);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    const mockMetadata: ArgumentMetadata = {
      type: 'body', // Simulating validation on request body
    };

    it('should return parsed data if valid', () => {
      const input = { query: 'test', limit: 5 };

      const result = pipe.transform(input, mockMetadata);

      expect(result).toEqual(input); // Input matches expected output
    });

    it('should throw BadRequestException if validation fails', () => {
      const invalidInput = { query: null };

      expect(() => {
        pipe.transform(invalidInput, mockMetadata);
      }).toThrow(BadRequestException);
    });

    it('should handle empty input gracefully by throwing BadRequestException', () => {
      const invalidInput = {}; // Empty input fails required "query"

      expect(() => {
        pipe.transform(invalidInput, mockMetadata);
      }).toThrow(BadRequestException);
    });

    it('should handle invalid data types by throwing BadRequestException', () => {
      const invalidInput = { query: 123, countryCode: 123, limit: 'not-a-number' };

      expect(() => {
        pipe.transform(invalidInput, mockMetadata);
      }).toThrow(BadRequestException);
    });

    it('should work with alternative schemas', () => {
      // Custom schema for more personalized validation
      const customSchema = z.object({
        email: z.string().email(),
      });
      const customPipe = new ZodValidationPipe(customSchema);

      const validInput = { email: 'test@test.com' };
      const invalidInput = { email: 'invalid-email' };

      // Valid case
      expect(customPipe.transform(validInput, mockMetadata)).toEqual(validInput);

      // Invalid case throws
      expect(() => {
        customPipe.transform(invalidInput, mockMetadata);
      }).toThrow(BadRequestException);
    });

    it('should not modify the input if valid', () => {
      const input = { query: 'test', limit: 5 };

      const result = pipe.transform(input, mockMetadata);

      expect(result).toEqual(input);
    });
  });
});