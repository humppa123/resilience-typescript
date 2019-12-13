import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import { NoLogger } from '../../app/logging/noLogger';
import { MemoryQueue } from '../../app/caching/memoryQueue';
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Resilence', () => {
  describe('Memory Queue', () => {
    const logger = new NoLogger();
    it('Should not pop if items count are equal to max length', done => {
      // Arrange
      const maxLength = 3;
      const queue = new MemoryQueue(maxLength, logger);

      // Act
      let result = queue.push('First');
      result = queue.push('Second');
      result = queue.push('Third');

      // Assert
      expect(result.hasPoped).to.equal(false);
      expect(result.popedItem).to.equal(null);
      expect(queue.length()).to.equal(3);

      // Cleanup
      done();
    });
    it('Should pop if more items are added than max length', done => {
      // Arrange
      const maxLength = 3;
      const lastPopedItem = 'Fifth';
      const queue = new MemoryQueue(maxLength, logger);

      // Act
      let result = queue.push('First');
      result = queue.push(lastPopedItem);
      result = queue.push('Third');
      result = queue.push('Fourth');
      result = queue.push('Fifth');

      // Assert
      expect(result.hasPoped).to.equal(true);
      expect(result.popedItem).to.equal(lastPopedItem);
      expect(queue.length()).to.equal(3);

      // Cleanup
      done();
    });
    it('Should not pop if item has been removed', done => {
      // Arrange
      const maxLength = 3;
      const queue = new MemoryQueue(maxLength, logger);
      const removedItem = 'Second';

      // Act
      let result = queue.push('First');
      result = queue.push(removedItem);
      result = queue.push('Third');
      queue.remove(removedItem);
      result = queue.push('Fourth');

      // Assert
      expect(result.hasPoped).to.equal(false);
      expect(result.popedItem).to.equal(null);
      expect(queue.length()).to.equal(3);

      // Cleanup
      done();
    });
  });
});
