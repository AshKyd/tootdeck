const assert = require('assert');
const util = require('../app/util');

describe('arrayUnique', () =>{
  it('should remove duplicates, leaving uniques', () => {
    const input = [1,2,3,4,4,4];
    const expected = [1,2,3,4];
    assert.deepEqual(
      util.arrayUnique(input),
      expected
    );
  });
});
describe('stripUndefined', () =>{
  it('should remote undefined values, leaving the rest', () => {
    const input = { a: 1, b: 2, c: undefined };
    const expected = { a: 1, b: 2 };
    assert.deepEqual(
      util.stripUndefined(input),
      expected
    );
  });
});
describe('acctToMention', () => {
  it('should add an @ to an username', () => {
    assert.deepEqual(
      util.acctToMention('AshKyd'),
      '@AshKyd'
    );
  });
  it('should not double the @ symbol', () => {
    assert.deepEqual(
      util.acctToMention('@AshKyd'),
      '@AshKyd'
    );
  });
});
