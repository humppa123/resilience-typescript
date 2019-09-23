import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { MemoryCache } from "../../app/caching/memoryCache";
import { TimeSpansInMilliSeconds } from "../../app/utils/timespans";
import { NoLogger } from "../../app/logging/noLogger";
import { CacheError } from "../../app/caching/cacheError";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Memory Cache", () => {
        const logger = new NoLogger();
        it("Should return false on unknown key in is already inserted check", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.ThirtyMinutes;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger);
            const key = "This should be unkown";

            // Act
            const result = cache.isAlreadyInCache(key);

            // Assert
            expect(result).to.equal(false);
        });
        it("Should return true on known key in is already inserted check", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.ThirtyMinutes;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger);
            const key = "This should be know";
            const value = "This is the value!";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + 60);

            // Act
            cache.insert(key, value, expires);
            const result = cache.isAlreadyInCache(key);

            // Assert
            expect(result).to.equal(true);
        });
        it("Should return correct value on known key", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.ThirtyMinutes;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger);
            const key = "This should be know";
            const value = "This is the value!";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + 60);

            // Act
            cache.insert(key, value, expires);
            const result = cache.retrieve(key);

            // Assert
            expect(result).to.equal(value);
        });
        it("Should return true if key has expired on expiration check", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.OneSecond;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger);
            const key = "This should be know";
            const value = "This is the value!";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() - 2 * 60);

            // Act
            cache.insert(key, value, expires);
            const result = cache.hasExpired(key);

            // Assert
            expect(result).to.equal(true);
        });
        it("Should return false if key has not expired on expiration check", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.OneMinute;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger);
            const key = "This should be know";
            const value = "This is the value!";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + 2 * 60);

            // Act
            cache.insert(key, value, expires);
            const result = cache.hasExpired(key);

            // Assert
            expect(result).to.equal(false);
        });
        it("Should remove no entry on garbage collection if they have not expired.", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.OneDay;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger, 1);
            const value = "This is the value!";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + 2 * 60);

            // Act
            cache.insert("key1", value, expires);
            cache.insert("key2", value, expires);
            cache.insert("key3", value, expires);
            cache.insert("key4", value, expires);
            cache.insert("key5", value, expires);
            const result = cache.garbageCollect();
            const length = cache.length();

            // Assert
            expect(result).to.equal(0);
            expect(length).to.equal(5);
        });
        it("Should remove entries on garbage collection if they have expired.", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.OneDay;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger, 1);
            const value = "This is the value!";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() - 2 * 60);

            // Act
            cache.insert("key1", value, expires);
            cache.insert("key2", value, expires);
            cache.insert("key3", value, expires);
            cache.insert("key4", value, expires);
            cache.insert("key5", value, expires);
            const result = cache.garbageCollect();
            const length = cache.length();

            // Assert
            expect(result).to.equal(5);
            expect(length).to.equal(0);
        });
        it("Should throw if no key is provided.", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.OneDay;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger, 1);
            const func = async () => {
                return "Hallo123!";
            };

            // Act
            // Assert
            await expect(cache.execute(func, null)).to.be.rejectedWith(CacheError);
        });
        it("If not in cache or expired func must be called and result of func returned.", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.OneDay;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger, 1);
            let called = 0;
            const key = "key";
            const response = "Hallo123";
            const func = async () => {
                called++;
                return response;
            };

            // Act
            const result = await cache.execute(func, key);

            // Assert
            expect(result).to.equal(response);
            expect(called).to.equal(1);
            expect(cache.length()).to.equal(1);
        });
        it("If called several times func should be called just once.", async () => {
            // Arrange
            const expirationTimeSpanMs = TimeSpansInMilliSeconds.OneDay;
            const cache = new MemoryCache<string>(expirationTimeSpanMs, logger, 1);
            let called = 0;
            const key = "key";
            const response = "Hallo123";
            const func = async () => {
                called++;
                return response;
            };

            // Act
            let result = await cache.execute(func, key);
            result = await cache.execute(func, key);
            result = await cache.execute(func, key);
            result = await cache.execute(func, key);
            result = await cache.execute(func, key);

            // Assert
            expect(result).to.equal(response);
            expect(called).to.equal(1);
            expect(cache.length()).to.equal(1);
        });
    });
});
