export interface AddressSuggestionResult {
  id: string;
  address: string;
  streetName: string,
  country: string,
  municipality: string,
  postalCode: string,
  latitude: number;
  longitude: number;
}