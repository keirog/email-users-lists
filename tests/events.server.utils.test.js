const should = require('should');

describe('Update Emitter', () => {
  it('can have event listeners attached', (done) => {
    const body = 'hello, world!';
    const updateEmitter = require('../app/utils/events.server.utils');
    updateEmitter.on('test', (testEvent) => {
      testEvent.should.equal(body);
      done();
    });
    updateEmitter.emit('test', body);
  });
});
