const util = require('./util');
const Mastodon = require('mastodon-api');
const dbUsers = new PouchDB('users');
const dbToots = new PouchDB('toots');

function Masto(config){
  this.config = config;
  this.m = new Mastodon({ access_token: config.accessToken, api_url: config.apiUrl });
}
Masto.prototype.getUser = function(userId=null, callback){
  if (userId === null) return this.m.get('accounts/verify_credentials', callback);
  return this.m.get(`accounts/encodeURIComponent(${userId})`, callback);
}
Masto.prototype.toot = function(options, callback) {
  const { tootCw, tootContent, tootNsfw, replyTo } = options;
  const payload = util.stripUndefined({
    status: tootContent,
    spoiler_text: tootCw,
    sensitive: tootNsfw,
    in_reply_to_id: replyTo && replyTo.id,
  });
  console.log(payload);
  return this.m.post('statuses', payload, callback);
}
Masto.prototype.timeline = function(options, callback){
  const { timeline } = options;
  let url;
  if(timeline === 'local') {
    url = `timelines/public?local=true`;
  } else {
    url = `timelines/${timeline}`;
  }
  return this.m.get(url, (error, statuses) => {
    if(error) return callback(error);
    this.processStatuses(statuses, callback);
  });
}
Masto.prototype.processStatuses = function(statuses, callback){
  dbToots.bulkDocs(statuses).catch(() => {});
  callback(null, statuses);
}
Masto.prototype.setBoost = function(status, boostStatus, callback){
  const action = boostStatus ? 'reblog' : 'unreblog';
  this.m.post(`statuses/${status.id}/${action}`, callback);
}
Masto.prototype.setFav = function(status, favStatus, callback){
  const action = favStatus ? 'favourite' : 'unfavourite';
  this.m.post(`statuses/${status.id}/${action}`, callback);
}

module.exports = Masto;
