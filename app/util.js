const util = module.exports = {
  arrayUnique: function(array){
    return Array.from(new Set(array));
  },
  stripUndefined: function(object){
    Object.keys(object).forEach(key => {
      if(typeof object[key] === 'undefined') delete object[key];
    });
    return object;
  },
  acctToMention: function(acct) {
    if(acct.substr(0,1) === '@') return acct;
    return `@${acct}`;
  },
  getReplyContent: function(status) {
    let mentions = [status.account.acct];
    if(status.mentions){
      mentions.push(...status.mentions.map(m => m.acct));
    }
    return util.arrayUnique(mentions).map(util.acctToMention).join(' ');
  },
};
