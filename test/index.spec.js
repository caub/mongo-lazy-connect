const assert = require('assert');
const db = require('..')('mongodb://localhost:27017/connect-sync-test');

afterAll(() => db.close());

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

it('should wait (when called as a prop) and then call .find', async () => {
	await db.open;
	const docs = await db.collection('foo').find({}).toArray();
	assert(Array.isArray(docs));
});

it('should wait (when called as a function) and then call .find', async () => {
	await db.open();
	const docs = await db.collection('foo').find({}).toArray();
	assert(Array.isArray(docs));
});
