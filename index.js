const {URL} = require('url');
const mongo = require('mongodb');

const NULL = Object.freeze(Object.create(null));

/**
 * 
 * @param {*} url 
 * @param {*} opts 
 */
module.exports = (url, opts) => {

	let client;
	let dbName;
	try {
		dbName = new URL(url).pathname.slice(1);
	} catch (e) {
		throw new Error('We expect the first argument to be a connection string url')
	}

	let close = () => Promise.resolve();
	let connect = async () => {
		return client || mongo(url, {useNewUrlParser: true, ...opts}).then(_client => {
			client = _client;
			close = () => {
				client = null;
				return _client.close();
			};
			return client;
		});
	};

	return new Proxy(NULL, {
		get(_, name) {
			if (name === 'client') return client;
			if (name === 'collection') {
				return collName => client ? client.db(dbName).collection(collName) : new Proxy(NULL, {
					get(_, funcName) {
						if (funcName === 'find') {
							const chain = (calls = []) => new Proxy(NULL, {
								get(_, name) {
									if (name === 'toArray' || name === 'then' || typeof name !== 'string') {
										return async () => {
											client = await connect();
											const coll = client.db(dbName).collection(collName);
											return calls.reduce((c, {name, args}) => c[name](...args), coll).toArray();
										};
									}
									return (...args) => chain(calls.concat({name, args}));
								}
							});
							return (...args) => chain([{name: 'find', args}]);
						}
						return async (...args) => {
							client = await connect();
							const coll = client.db(dbName).collection(collName);
							return coll[funcName](...args);
						};
					}
				});
			}

			if (name === 'connect') {
				return connect;
			}
			if (name === 'close') {
				return close;
			}

			return async (...args) => {
				if (client) {
					client = await connect();
				}
				if (!client.db(dbName)[name]) {
					throw new Error(`This Db method doesn't exists, valid ones are: http://mongodb.github.io/node-mongodb-native/3.0/api/Db.html`)
				}
				return client.db(dbName)[name](...args);
			};
		}
	});
};
