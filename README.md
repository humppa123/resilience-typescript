# Resilience Typescript

`resilience-typescript` is a Typescript resilience and transient-fault-handling library that allows developers to add components like **Timeout**, **Retry**, **Circuit Breaker**, **Cache**, **Token Cache** to outgoing HTTP(S) calls, built on top of the [Axios](https://github.com/axios/axios) library with a fluent language. Primarly designed for backend service to service communication.

![icon](./.media/icon.png)

## Installation

Run the following command:

`npm i resilience-typescript`

## Quickstart

TODO

## Builders

### Resilient Pipeline Builder

Allows you to create a customizable resilient pipeline, where you can chain e.g. a circuit breaker with a retry with a timeout. See the documentation for each component on how to set eachs parameters.

```typescript
const pipeline = ResilientPipelineBuilder
    .New()
    .addLogger(new ConsoleLogger())
    .useCircuitBreaker(2, TimeSpansInMilliSeconds.TenMinutes, 10)
    .useRetry(3, 3)
    .useTimeout(4, TimeSpansInMilliSeconds.OneHundredMilliSeconds)
    .build();
```

### Resilient Web Pipeline Builder



## Components

### Pipeline

A pipeline of so called resilience proxies (like Timeout, Retry and Circuit Breaker) that allows you to chain components together. You can build for instance a highly resilient pipeline were a Timeout is followed by a retry, whose is followed then by a Circuit Breaker.

![pipeline](./.media/pipeline.png)

```typescript
const proxies: IResilienceProxy[] = [];
// Circuit Breaker calls Retry calls Timeout calls func
proxies.push(new CircuitBreakerProxy()); // Constructor is missing parameters for demonstration purpose!
proxies.push(new RetryProxy()); // Constructor is missing parameters for demonstration purpose!
proxies.push(new TimeoutProxy()); // Constructor is missing parameters for demonstration purpose!
const pipeline = new PipelineProxy(proxies);
const func = async () => {...}; // An async function that does the real work and must be resolved within the pipeline

// Executes func in timeout, then timeout result in retry, then the result of retry in circuit breaker.
const result = await pipeline.execute(func);
```

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
    console.log(e.message); // A TimeoutError, its "innerError" contains the real error.
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
    console.log(e.message); // A RetryError, its "innerError" contains the real error.
}
```

### Circuit Breaker

Allows a func to fail a configurable times before failing fast on a subsequent func call. On failure a `CircuitBreakerError` will be thrown with the `innerError` property containing the real error.

![circuitbreaker](./.media/circuitbreaker.png)

```typescript
// Arrange
const breakDuration = TimeSpansInMilliSeconds.OneMinute; // If circuit breaker state is set to open, subsequent calls will fail fast within the next minute.
const maxFailedCalls = 5; // Circuit breaker will go into open state after five failed calls.
const logger = new NoLogger(); // Empty logger, see Logging chapter.
const circuitBreaker = new CircuitBreakerProxy(breakDuration, maxFailedCalls, logger, null);
const func = async () => {...}; // An async function that does the real work
try {
    const result = await circuitBreaker.execute(func); // Executes the provided func at most three times if it fails.
} catch (e) {
    console.log(e.message); // A CircuitBreakerError, its "innerError" contains the real error.
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

### Cache

An interface to provide a caching mechanism to not always query a depended service. A default implementation is provided with the `MemoryCache`. You can easily create your own implementation by implementing the following interface:

```typescript
export interface ICache<TKey, TResult> {
    /**
     * Executes a function within a cache. If the value is in the cache and has not expired, it will be returned from the cache, else it will be queried from the func and added to the cache.
     * @param func Function to get the value if not in cache or has expired.
     * @param key The key to use for this value.
     */
    execute(func: (...args: any[]) => Promise<TResult>, key?: TKey): Promise<TResult>;
}
```

#### Memory Cache

A default implementation of a cache that stores all values in memory. To minimze memory usage, you can specify a sliding expiration of cache entries whereas garbage collection will take place on every configurable call to the cache. Also you can limit the maximum number of items in the cache.  

![memory](./.media/memorycache.png)

```typescript
const expirationTimeSpanMs = TimeSpansInMilliSeconds.OneHour; // Cache entries expire after one hour
const garbageCollectEveryXRequests = 100; // Removing of expired items will take place every 100 calls to the 'execute' function
const maxEntryCount = 500; // Cache holds 500 entries maximum. If more are added, the oldest will be removed.
const key = "KeyForFunc"; // The key for the result of the func. Must be provided.
const func = async () => {...}; // An async function that does the real work and whose result will be stored in the cache if not already present.
const cache = new MemoryCache<string>(expirationTimeSpanMs, logger, garbageCollectEveryXRequests, maxEntryCount);
try {
    const result = await cache.execute(func, key); // Returns a value from the cache if present or executes the func to get the value and stores it in the cache under the given key.
} catch (e) {
    console.log(e.message); // A CacheError, its "innerError" contains the real error.
}
```

### Queue

An interface to provide a queue in TypeScript, it is used in the `MemoryCache` to limit the maximum count of entries in the cache. A default implementation is provided with the `MemoryQueue`.

```typescript
/**
 * A queue with a defined maximum lenght.
 */
export interface IQueue<T> {
    /**
     * The maximum length of the queue.
     */
    readonly maxLength: number;

    /**
     * Adds a new item to the beginning of the queue.
     * @param value The item to add at the beginning of thequeue.
     * @returns An object describing whether a pop was required to add the item to the queue.
     */
    push(value: string): QueuePushResult<T>;

    /**
     * Removes the last item from the queue.
     * @returns The removed item of undefined.
     */
    pop(): T | undefined;
}
```

#### Memory Queue

A simple default implementation of a queue to limit the maximum count entries in the `MemoryCache`.

```typescript
const maxLength = 100; // Maximum size of the queue is 100 entries.
const queue = new MemoryQueue(maxLength, logger);
const result = queue.push("First"); // Adds a new entry to the queue.
const hasPoped = result.hasPoped; // Gets a value if a value was removed from the queue due to the size limit of the queue has reached.
const popedItem = result.popedItem; // Gets the value that was removed from the queue due to the size limit if any.
```
