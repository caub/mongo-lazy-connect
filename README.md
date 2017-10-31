[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]

Similarly to other DBs, let's allow a synchronous access to the MongoDB driver pool

```js
const connectSync = require('mongo-connect-sync');

const db = connectSync('mongodb://localhost:27017/connect-sync-test');

db.foo.insertOne({bar: 2}).then(() => {
	db.foo.find({}).limit(5).toArray().then(console.log);
});

// db.connect is a special property, a Promise returning the db
```

is equivalent to:

```js
const MongoClient = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/connect-sync-test')
	.then(db => {
		db.collection('foo').insertOne({bar: 2}).then(() => {
			db.collection('foo').find({}).limit(5).toArray().then(console.log);
		});
	});
```

[npm-image]: https://img.shields.io/npm/v/mongo-connect-sync.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mongo-connect-sync
[travis-image]: https://img.shields.io/travis/caub/mongo-connect-sync.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/mongo-connect-sync
[codecov-image]: https://img.shields.io/codecov/c/github/caub/mongo-connect-sync.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/caub/mongo-connect-sync