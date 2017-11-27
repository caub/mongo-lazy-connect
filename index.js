const MongoClient = require('mongodb');

const NULL = Object.freeze(Object.create(null));

module.exports = opts => {

	let db;
	const dbPromise = MongoClient.connect(opts).then(_db => {
		return db = _db;
	});

	return new Proxy(NULL, {
		get(_, collName) {
			if (collName === 'collection') {
				return new Proxy(() => {}, {
					apply(_, _thisArg, args) {
						// fallback to a proxy to relay promises (except .find that returns a Stream), when db is not set yet
						return db ? db.collection(collName) : new Proxy(NULL, {
							get(_, funcName) {
								if (funcName === 'find') {
									throw new Error('for calling collection.find initially, you need to await db.open method first');
								}
								return new Proxy(() => {}, {
									async apply(_, _thisArg, args) {
										db = await dbPromise;
										const coll = db.collection(collName);
										return Promise.resolve(coll[funcName](...args));
									}
								});
							}
						});
					}
				});
			}

			if (collName === 'open') {
				return new Proxy(() => {}, {
					get() {
						return dbPromise;
					},
					apply() {
						return dbPromise;
					}
				});
			}

			if (db) {
				return db[collName];
			}
			throw new Error('for calling other db methods (http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html) initially, you need to call db.open first, or implement them by contributing to this project!')
		}
	});
};
