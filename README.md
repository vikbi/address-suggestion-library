## Description

This project focuses on providing address suggestions based on a user query. It allows you to add multiple custom providers (e.g., Google Maps API, etc) to extend its functionality and flexibility.
The primary service integrates with the `TomTom API` to fetch address suggestions based on user input.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Services
### TomTomService
- **Purpose**: Handles communication with the `TomTom API`.
- **Responsibilities**:
    - Builds the API requests specific to TomTom, including query parameters like `countryCode`, `limit`, etc.
    - Parses the response received from the API into an internal, pre-defined structure (`AddressSuggestionResult`).
    - Validates results received from the API using `zod`.

- **Key Methods**:
    - **`suggestAddresses(query: AddressSuggestionRequestDto): Promise<AddressSuggestionResult[]>`**: Fetches address suggestions from the TomTom API based on the user query.

- **Default Behavior**:
    - Filters results by `countryCode = AU` (Australia) by default.
    - Logs errors and validates the API response before returning.

### AddressSuggestionService
- **Purpose**: Acts as a centralized service to communicate with address suggestion providers.
- **Responsibilities**:
    - Delegates query handling to the appropriate provider (e.g., TomTom, custom providers).
    - Provides an interface (`AddressSuggestionProvider`) for adding custom providers.

- **Key Methods**:
    - **`suggestAddresses(query: AddressSuggestionRequestDto): Promise<AddressSuggestionResult[]>`**: Delegates the user query received in the controller to the injected provider (e.g., `TomTomService`).

## How to Use the Service
1. **Endpoint**:
    - The `GET /suggest` endpoint is used to fetch address suggestions based on the query parameters.

2. **Query Parameters**:
    - `query`: The search input for the address (required).
    - `limit`: The maximum number of suggestions (optional, defaults might apply).
    - `countryCode`: Hardcoded as `AU` for Australian addresses (currently not configurable externally).

3. **Example Usage**:
``` 
   GET /suggest?query=Sydney&limit=5
```
## Adding Custom Address Suggestion Providers
The application allows adding custom providers if you want to fetch suggestions from other external sources (e.g., Google Maps, etc).
All custom providers must implement the `AddressSuggestionProvider` interface to ensure consistency.
new provider must be registerd with AddressSuggestionModule to be used by external services.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
