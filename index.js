const MongoClient = require('mongodb');

const NULL = Object.freeze(Object.create(null));

module.exports = opts => {

	let db;

	const open = async () => {
		return db || MongoClient.connect(opts).then(_db => {
			return db = _db;
		});
	};

	return new Proxy(NULL, {
		get(_, name) {
			if (name === 'collection') {
				return collName => db ? db.collection(collName) : new Proxy(NULL, {
					get(_, funcName) {
						if (funcName === 'find') {
							const chain = (calls = []) => new Proxy(NULL, {
								get(_, name) {
									if (name === 'toArray' || name === 'then' || typeof name !== 'string') {
										return async () => {
											db = await open();
											const coll = db.collection(collName);
											return calls.reduce((c, { name, args }) => c[name](...args), coll).toArray();
										};
									}
									return (...args) => chain(calls.concat({ name, args }));
								}
							});
							return (...args) => chain([{ name: 'find', args }]);
						}
						return async (...args) => {
							db = await open();
							const coll = db.collection(collName);
							return Promise.resolve(coll[funcName](...args));
						};
					}
				});
			}

			if (name === 'open') {
				return open;
			}
			if (name === 'close') {
				return () => open().then(_db => {
					db = null;
					return _db.close();
				});
			}

			if (db) {
				return db[name];
			}
			throw new Error('for calling other db methods (http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html) initially, you need to call db.open first, or implement them by contributing to this project!')
		}
	});
};
