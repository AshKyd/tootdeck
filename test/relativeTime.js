const assert = require('assert');
const relativeTime = require('../app/relativeTime');
describe('relativeTime', () => {
  it('should return 0s when dates match', () => {
    assert.deepEqual(
      relativeTime(new Date(0), new Date(0)),
      '0s'
    );
  });
  it('should return 1s when one second apart', () => {
    assert.deepEqual(
      relativeTime(new Date(0), new Date(1000)),
      '1s'
    );
  });
  it('should return 1m when 60s apart', () => {
    assert.deepEqual(
      relativeTime(new Date(0), new Date(1000*60)),
      '1m'
    );
  });
  it('should return 2m when 120s apart', () => {
    assert.deepEqual(
      relativeTime(new Date(0), new Date(2000*60)),
      '2m'
    );
  });
  it('should return 1h when 1h apart', () => {
    assert.deepEqual(
      relativeTime(new Date(0), new Date(1000*60*60)),
      '1h'
    );
  });
  it('should return 1d when 1d apart', () => {
    assert.deepEqual(
      relativeTime(new Date(0), new Date(1000*60*60*24)),
      '1d'
    );
  });
  it('should return 1y when 1y apart', () => {
    assert.deepEqual(
      relativeTime(new Date(0), new Date(1000*60*60*24*365)),
      '1y'
    );
  });
});
