const nodeUrl = require('url');
const util = module.exports = {
  /**
   * Get the avatar URL from an account
   * @param {Object} account status.account object
   * @return {String}        url for this user
   */
  resolveAvatar(account){
    const { url, avatar } = account;

    // The avatar is relative. Resolve it against the user's url
    if(avatar.match(/^\/[^/]/)){
      return nodeUrl.resolve(url, avatar);
    }

    return avatar;
  },
  /**
   * Remove duplicates in an array
   * @param  {Array} array
   * @return {Array}
   */
  arrayUnique(array){
    return Array.from(new Set(array));
  },
  /**
   * Remove keys from an object where the value is undefined
   * @param  {Object} object
   * @return {Object}
   */
  stripUndefined(object){
    const newObject = Object.assign({}, object);
    Object.keys(newObject).forEach(key => {
      if(typeof newObject[key] === 'undefined') delete newObject[key];
    });
    return newObject;
  },
  /**
   * Ensure a username starts with an @.
   * @param  {String} acct username or @username
   * @return {String}      username with a starting @
   */
  acctToMention(acct) {
    if(acct.substr(0,1) === '@') return acct;
    return `@${acct}`;
  },
  /**
   * Get the usernames we would need to @ to reply to the given status
   * @param  {Object} status Mastodon API status object
   * @return {String}        String in the form of "@user1 @user2"…
   */
  getReplyContent(status) {
    let mentions = [status.account.acct];
    if(status.mentions){
      mentions.push(...status.mentions.map(m => m.acct));
    }
    return util.arrayUnique(mentions).map(util.acctToMention).join(' ');
  },
};
