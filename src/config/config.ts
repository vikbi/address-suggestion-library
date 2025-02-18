import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  tomtomApiKey: process.env.TOMTOM_API_KEY || 'Oyb0npJAVdRwDauqpFez7zKCy2euUYql'
}));