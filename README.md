[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]

Similarly to other DBs (like `const pool=new pg.Pool('pg://...'); pool.query('select ..').then(console.log)`), let's allow a lazy access to the MongoDB driver pool

```js
const db = require('mongo-lazy-connect')('mongodb://localhost:27017/connect-test');

const coll = db.collection('foo');
coll.insertOne({bar: 2}).then(() => {
	coll.find({}).limit(5).toArray().then(console.log);
});
```

is equivalent to:

```js
const mongo = require('mongodb');

mongo('mongodb://localhost:27017/connect-test')
	.then(client => {
		const coll = client.db('connect-test').collection('foo');
		coll.insertOne({bar: 2}).then(() => {
			coll.find({}).limit(5).toArray().then(console.log);
		});
	});
```

[npm-image]: https://img.shields.io/npm/v/mongo-lazy-connect.svg?style=flat-square&maxAge=86400
[npm-url]: https://www.npmjs.com/package/mongo-lazy-connect
[travis-image]: https://img.shields.io/travis/caub/mongo-lazy-connect.svg?style=flat-square&maxAge=86400
[travis-url]: https://travis-ci.org/caub/mongo-lazy-connect
[codecov-image]: https://img.shields.io/codecov/c/github/caub/mongo-lazy-connect.svg?style=flat-square&maxAge=86400
[codecov-url]: https://codecov.io/gh/caub/mongo-lazy-connect