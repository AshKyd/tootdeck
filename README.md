Tootdeck
========

A very WIP multi-account mastodon client, built with Ractive (for rapid prototyping) and PouchDB for local storage.

Planned features
----------------

Did I mention this is WIP? I'm ultimately hoping to do the following:

* ☑️ Log in with multiple accounts
* ☑️ Toot from multiple accounts
* ☑️ Add home/local/federated columns from multiple accounts
* ☑️ Boost/fav/unboost/unfav statuses
* ☑️ Reply to a status
* Reply to statuses that were never pushed to your instance
* Polling updates and/or streaming API support
* Add local timelines from other instances (using the [public timeline method](https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#timelines))
* Local & remote search (search PouchDB cache + regular Mastodon search endpoint)
* Curate lists of users you're following
* Scrollback support
* Deodorize code smells, maybe implement V2 in React
