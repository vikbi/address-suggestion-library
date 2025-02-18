import { registerAs } from '@nestjs/config';

export default registerAs('tomtom', () => ({
  tomtomApiKey: process.env.TOMTOM_API_KEY,
  baseUrl: 'https://api.tomtom.com',
}));