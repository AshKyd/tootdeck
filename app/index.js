const relativeTime = require('./relativeTime');
const auth = require('./auth');
const util = require('./util');
const Instance = require('./instance');
const upsert = require('./upsert');
const dbAccounts = new PouchDB('accounts');
const dbToots = new PouchDB('toots');
const async = require('async');
const instances = [];
const columns = [
  {
    name: 'Home',
    call: 'timeline',
    data: {timeline: 'home'},
  },
  {
    name: 'Public',
    call: 'timeline',
    data: {timeline: 'public'},
  },
  {
    name: 'Local',
    call: 'timeline',
    data: {timeline: 'local'},
  }
  // Notifications: {
  //   name: 'Notifications',
  // }
];

function saveAccounts(callback){
  upsert(dbAccounts, ractive.get('accounts'), callback);
}

// load account data from db, then load users
function refreshInstances(){
  dbAccounts.get('accounts')
    .catch(error => {
      console.warn('error loading accounts', error);
    })
    .then(accounts => {
    if(!accounts) accounts = {_id: 'accounts'};
    // data migration
    if(!accounts.configuredColumns) accounts.configuredColumns = [];
    // let's go
    ractive.set('accounts', accounts);
    async.eachOf(
      accounts.accounts,
      function(account, index, callback){
        const instance = new Instance({
          accessToken: account.accessToken,
          apiUrl: `https://${account.instance}/api/v1/`,
        });
        instances[index] = instance;
        instance.getUser(null, (error, user) => {
          ractive.set(`accounts.accounts.${index}.user`, user);
          // swallow errors for now
          callback();
        });
      },
      function(error){
        if(error) ractive.set('error', error);
        ractive.fire('refreshColumns');
      });

  });
}
refreshInstances();
Ractive.defaults.data.resolveAvatar = util.resolveAvatar;
Ractive.defaults.data.relativeTime = function(time){
  const date = new Date(time);
  return relativeTime(date, new Date());
};
var ractive = window.ractive = new Ractive({
  el: '#container',
  template: '#template',

  // Here, we're passing in some initial data
  data: {
    columns,
    tootFromId: null,
    addColumnFromId: null,
    columnData: [],
    accounts: {
      _id: 'accounts',
      configuredColumns: [],
      accounts: [],
    },
  },

});

ractive.on('addColumn', function(options){
  ractive.push('accounts.configuredColumns', options);
  ractive.fire('refreshColumns');
  saveAccounts();
});

ractive.on('removeColumn', function(index){
  ractive.splice('accounts.configuredColumns', index, 1);
  ractive.splice('columnData', index, 1);
  saveAccounts();
});

ractive.on('refreshColumns', function(){
  let configs = ractive.get('accounts.configuredColumns');

  configs.forEach((config, i) => {
    const { addColumnFromId, name } = config;
    const columnDef = columns.find(column => column.name === name);
    const instance = instances[addColumnFromId];
    instance[columnDef.call](columnDef.data, function(error, toots){
      ractive.set(`columnData.${i}`, {
        name: columnDef.name,
        columnIndex: i,
        userIndex: addColumnFromId,
        user: ractive.get(`accounts.accounts.${addColumnFromId}.user`),
        data: toots,
      });
    });
  });
});

ractive.on('toggleAction', function(action, status, keyPath, index){
  const boolName = action === 'boostStatus' ? 'reblogged' : 'favourited';
  const boolKeyPath = `${keyPath}.${boolName}`;
  const instance = instances[index];
  const changedStatus = !status[boolName];
  ractive.set(boolKeyPath, changedStatus);
  instance[action](status, changedStatus, function(error){
    if(error){
      ractive.set(boolKeyPath, !changedStatus);
      return;
    }
  });
});

ractive.on('getAuthUrl', function(){
  auth.getAuthUrl(ractive.get(), function(error, state){
    if(error) alert(error);
    ractive.set(state);
  })
});

ractive.on('toot', function(){
  const { tootFromId, cw, tootCw, tootContent, replyTo, tootNsfw } = ractive.get();
  const instance = instances[tootFromId];
  instance.toot({
    tootCw: cw && tootCw,
    tootContent,
    replyTo,
    tootNsfw
  }, function(error, res){
    if(error) return ractive.set('error', error);
    ractive.set({
      fromId: null,
      tootCw: '',
      tootContent: '',
      in_reply_to_id: replyTo && replyTo.id,
    })
  });
});

ractive.on('tootReply', function(status, index){
  ractive.set({
    replyTo: status,
    tootFromId: index,
    tootContent: util.getReplyContent(status) + '',
  });
});

ractive.on('getAccessToken', function(){
  auth.getAccessToken(ractive.get(), function(error, state){
    if(error) return ractive.set('error', error);
    ractive.set(state);
    const { accessToken } = state;
    const instance = new Instance({
      accessToken,
      apiUrl: `https://${ractive.get('instance')}/api/v1/`,
    });
    const account = {
      accessToken,
      instance: ractive.get('instance')
    };
    ractive.push('accounts.accounts', account);
    saveAccounts(refreshInstances);
  })
});
