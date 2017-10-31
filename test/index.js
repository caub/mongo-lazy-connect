const connectSync = require('../');
const assert = require('assert');

const db = connectSync('mongodb://localhost:27017/connect-sync-test');

describe('Main test', () => {
	it('Basic flat methods should work', async () => {
		await db.foo.deleteMany();
		await db.foo.insertOne({bar: 2});
		const doc = await db.foo.findOne({});
		assert(doc);
		assert.equal(doc.bar, 2);
	});
});