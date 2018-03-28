const assert = require('assert');
const db = require('..')('mongodb://localhost:27017/connect-test');

if (!global.it) { // quick testing without jest, can be removed
	let p = Promise.resolve();
	global.it = (desc, cb) => {
		p = p.then(() => {
			console.log(desc);
			return cb();
		})
	};
	global.afterAll = cb => setImmediate(() => p.finally(cb));
}

afterAll(() => db.close());

it('should work with .find initially', async () => {
	const docs = await db.collection('foo').find({}).limit(5).toArray();
	assert(Array.isArray(docs));
});

it('should close then reconnect automatically (by calling .connect or not) with any query', async () => {
	await db.close();
	await db.close();
	const docs = await db.collection('foo').find({}).toArray();
	assert(Array.isArray(docs));

	await db.connect();
});

it('should work with basic collection methods', async () => {
	await db.collection('foo').deleteMany();
	await db.collection('foo').insertOne({bar: 2});
	const doc = await db.collection('foo').findOne({});
	assert(doc);
	assert.equal(doc.bar, 2);
});

it(`should work with .find when it's not the first call`, async () => {
	const foo = db.collection('foo');
	await foo.deleteMany();
	await foo.insertOne({bar: 2});
	const docs = await foo.find({}).toArray();
	assert(Array.isArray(docs));
	assert.equal(docs.length, 1);
	assert.equal(docs[0].bar, 2);
});

it('should call other Db methods', async () => {
	const stats = await db.stats();
	assert.equal(stats.db, 'connect-test');
});
