import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { LeakingBucket } from "../../app/resilience/leakingBucket";
import { TimeSpansInMilliSeconds } from "../../app/utils/timespans";
import { sleep } from "../../app/resilience/utils";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Leaking Bucket", () => {
        it("Should work :-D", async () => {
            // Arrange
            const timeSpan = TimeSpansInMilliSeconds.OneHundredMilliSeconds;
            const maxEntries = 3;
            const bucket = new LeakingBucket(timeSpan, maxEntries);

            // Act
            // Assert
            expect(bucket.length()).to.equal(0);
            expect(bucket.isFull()).to.equal(false);

            bucket.insert(new Date());

            expect(bucket.length()).to.equal(1);
            expect(bucket.isFull()).to.equal(false);

            await sleep(150);
            bucket.leak();

            expect(bucket.length()).to.equal(0);
            expect(bucket.isFull()).to.equal(false);

            bucket.insert(new Date());
            bucket.insert(new Date());
            bucket.insert(new Date());

            expect(bucket.length()).to.equal(3);
            expect(bucket.isFull()).to.equal(true);

            await sleep(150);
            bucket.leak();

            expect(bucket.length()).to.equal(0);
            expect(bucket.isFull()).to.equal(false);

            bucket.insert(new Date());

            expect(bucket.length()).to.equal(1);
            expect(bucket.isFull()).to.equal(false);

            bucket.clear();

            expect(bucket.length()).to.equal(0);
            expect(bucket.isFull()).to.equal(false);
        });
    });
});
