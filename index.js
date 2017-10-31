const MongoClient = require('mongodb');

const NULL = Object.freeze(Object.create(null));

module.exports = opts => {

	const dbPromise = MongoClient.connect(opts).then(_db => {
		return db = _db;
	});
	let db;

	return new Proxy(NULL, {
		get(_, collName) {
			if (collName === 'connect') {
				return new Proxy(() => {}, {
					get() {
						return dbPromise;
					},
					apply() {
						return dbPromise;
					}
				});
			}
			if (typeof collName !== 'string' || collName === 'inspect') {
				return;
			}

			return db ? db.collection(collName) : new Proxy(NULL, {
				get(_, funcName) {
					if (funcName === 'find') {
						throw new Error('for calling .find initially, you need to await .connect function first');
					}
					return new Proxy(() => {}, {
						async apply(_, thisArg, args) {
							db = await dbPromise;
							const coll = db.collection(collName);
							return Promise.resolve(coll[funcName](...args));
						}
					});
				}
			});
		}
	});
};
