# SRS Resilience

![icon](./.media/icon.png)

SRS Resilience is a Typescript resilience and transient-fault-handling library that allows developers to add components like **Timeout**, **Retry**, **Circuit Breaker**, **Cache**, **Token Cache** to outgoing HTTP(S) calls, built on top of the [Axios](https://github.com/axios/axios) library with a fluent language. Primary designed for backend to backend communication.

## Quickstart

TODO

## Components

### Timeout

Checks if a promise resolves within a given timespan in ms. If not, it fails with a `TimeoutError`.

![timeout](./.media/timeout.png)

```typescript
const timeoutMs = 500; // The timeout in milli seconds.
const logger = new NoLogger(); // Empty logger, see Logging chapter.
const timeout = new TimeoutProxy(timeoutMs, new NoLogger()); // Create a new timeout proxy.
const func = async () => {...}; // An async function that does the real work and must be resoloved within the timeout
try {
    const result = await timeout.execute(func); // Executes the provided func if it does not resolve within the timespan, a TimeoutError will be thrown, else its result will be returned
} catch (e) {
    console.log(e.message); // A TimeoutError.
}
```

### Retry

Tries to execute a promise a serveral times. If the promise rejects every time, a `RetryError` is thrown containing the error causing the promise to reject in the `innerError` property.

![retry](./.media/retry.png)

```typescript
const retries = 3; // Number of retries
const logger = new NoLogger(); // Empty logger, see Logging chapter.
const retry = new RetryProxy(retries, new NoLogger()); // Create a new retry proxy.
const func = async () => {...}; // An async function that does the real work and shall be retried if it fails
try {
    const result = await retry.execute(func); // Executes the provided func at most three times if it fails.
} catch (e) {
    console.log(e.message); // A RetryError, its "innerException" contains the real error.
}
```

### Token Cache

A component that uses an implementation of the `ITokenProvider` interface to request a **Bearer** authorization token. As long as this token does not expire, it will be added automatically to all subsequent web calls `Authorization` header. If the token expires, a new one will be automatically requested. A default implementation is available with the `DefaultTokenCache` class.

![tokenCache](./.media/tokencache.png)

#### ITokenProvider

You can easily add your own authorization provider, by implementing the `ITokenProvider` provider where you request a token in any format and convert it to the general `Token` class:

```typescript
    /**
     * Gets an access token.
     * @returns An access token.
     */
    getToken(): Promise<Token>;
```

#### Azure Active Directory App Registration Token Provider

There's been already added a token provider for an Azure Active Directory App Registration. You'll need to provide the following information:

* `baseUrl`: Base URL for the token endpoint. Most of the time you'll be fine with <https://login.microsoftonline.com>
* `clientId`: The GUID of your app registration. You can find this in the Azure portal.
* `clientSecret`: A secret you've created for your app registration in the Azure portal.
* `tenantId`: The GUID of your Azure Active Directory. You can find this also in the Azure portal.
* `logger`: An implementation of the `ILogger<TState>` interface. You can find more information in the [Logging](#logging) section.

```typescript
const baseUrl = "https://login.microsoftonline.com";
const clientId = "YOUR_CLIENT_ID";
const clientSecret = "YOUR_CLIENT_SECRET";
const tenantId = "YOUR_TENANT_ID";
const logger: ILogger<string> = new NoLogger();
const provider: ITokenProvider = new AzureActiveDirectoryAppRegistrationTokenProvider(baseUrl, clientId, clientSecret, tenantId, logger);

const result = await provider.getToken(); // A valid token for Bearer authorization that can be used by a token cache.
```

### Logging

This package contains its own logging mechanism but you can easily include your own logger by extending the `AbstractStringLogger` class, implementing the `protected abstract logHandler(logLevel: LogLevel, state: string, error: Error, formatter: (s: string, e: Error) => string): void;` method and calling your own logger inside of it.

There are also three predefined logger already included:

* `ConsoleLogger`: A logger that writes every log message independent of its log level to the console.
* `NoLogger`: A logger that does nothing, it basically disables all logging.
* `TestLogger`: A logger that's primary designed for unit tests where you can provide a callback that will be called for each log message, to test if and what log messages are generated.

## TODO

* Circuit Breaker
* Circuit Breaker unit tests
* Logger must be able to have multiple implementatis (console + appnsinghts)
* Combined Handler (Pipeline?!?)
* Combined Handler Builder
* ICache
* MemoryCache
* RedisCache
* Axios Integration
* Axios Request Builder
* Simple Axios Request Builder
* Documentation
  * Diagrams a la Circuit Breaker for all Resilience and Combined handler
* Gitlab NPM registry
* Publish to Github, push automatically from local Gitlab
