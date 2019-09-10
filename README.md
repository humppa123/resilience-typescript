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

A cache that stores `Bearer` tokens and 

#### ITokenProvider



#### Azure Active Directory App Registration Token Provider

### Logging

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
