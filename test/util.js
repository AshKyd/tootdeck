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
describe('getReplyContent', () => {
  function makeStatus(username, mentions){
    const status = {
      id: 1,
      account: {
        acct: username,
      },
    };
    if(mentions){
      status.mentions = mentions.map(mention => ({
        acct: mention,
      }))
    }
    return status;
  }
  it('should return one username when no mentions are set', () => {
    const status = makeStatus('AshKyd');
    assert.deepEqual(
      util.getReplyContent(status),
      '@AshKyd'
    );
  });
  it('should return one username when the poster is replying to themselves', () => {
    const status = makeStatus('AshKyd', ['AshKyd']);
    assert.deepEqual(
      util.getReplyContent(status),
      '@AshKyd'
    );
  });
  it('should return two usernames when the user is replying to someone', () => {
    const status = makeStatus('AshKyd', ['MaloryArcher']);
    assert.deepEqual(
      util.getReplyContent(status),
      '@AshKyd @MaloryArcher'
    );
  });
  it('should return any number of usernames', () => {
    const status = makeStatus('AshKyd', ['MaloryArcher', 'LenTrexler']);
    assert.deepEqual(
      util.getReplyContent(status),
      '@AshKyd @MaloryArcher @LenTrexler'
    );
  });
});
