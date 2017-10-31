const connectSync = require('../');
const assert = require('assert');

const db = connectSync('mongodb://localhost:27017/connect-sync-test');

describe('Main test', () => {
	it('should work with basic collection methods', async () => {
		await db.foo.deleteMany();
		await db.foo.insertOne({bar: 2});
		const doc = await db.foo.findOne({});
		assert(doc);
		assert.equal(doc.bar, 2);
	});

	it(`should work with .find when it's not the first call`, async () => {
		await db.foo.deleteMany();
		await db.foo.insertOne({bar: 2});
		const docs = await db.foo.find({}).toArray();
		assert(Array.isArray(docs));
		assert.equal(docs.length, 1);
		assert.equal(docs[0].bar, 2);
	});

	it('should wait (when called as a prop) and then call .find', async () => {
		await db.connect;
		const docs = await db.foo.find({}).toArray();
		assert(Array.isArray(docs));
	});

	it('should wait (when called as a function) and then call .find', async () => {
		await db.connect();
		const docs = await db.foo.find({}).toArray();
		assert(Array.isArray(docs));
	});
});