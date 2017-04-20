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
  const { tootCw, tootContent, tootNsfw } = options;
  return this.m.post('statuses', {
    status: tootContent,
    spoiler_text: tootCw,
    sensitive: tootNsfw,
  }, callback);
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
Masto.prototype.boost = function(status, callback){
  this.m.post(`statuses/${status.id}/reblog`, callback);
}

module.exports = Masto;
