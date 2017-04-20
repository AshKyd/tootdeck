const Mastodon = require('mastodon-api');

module.exports = {
  getAuthUrl: function(options, callback) {
    const { instance } = options;
    let id;
    let clientId;
    let clientSecret;

    const baseUrl = `https://${instance}`;
    Mastodon.createOAuthApp(`${baseUrl}/api/v1/apps`, 'tootdeck')
      .catch(err => console.error(err))
      .then((res) => {
        clientId = res.client_id;
        clientSecret = res.client_secret;
        id = res.id;
        return Mastodon.getAuthorizationUrl(clientId, clientSecret, baseUrl)
      })
      .catch(err => callback(err))
      .then(url => {
        console.log(url);
        return callback(null, {
          id,
          clientId,
          clientSecret,
          url,
        });
      });
  },
  getAccessToken: function(options, callback) {
    const { instance, clientId, clientSecret, code } = options;
    const baseUrl = `https://${instance}`;
    Mastodon.getAccessToken(clientId, clientSecret, code, baseUrl)
      .catch(err => callback(err))
      .then(accessToken => {
        callback(null, {
          accessToken,
        });
      })
  }
};
