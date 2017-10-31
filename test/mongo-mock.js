// not used, yet

module.exports = opts => new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve({
			collection(name) {
				return {
					deleteMany() {
						return Promise.resolve();
					},
					insertOne() {
						return Promise.resolve();
					},
					find() {
						rejec(new Error('not impl'))
					},
					findOne(o) {
						return Promise.resolve({...o, _id: Math.floor(1e15*Math.random()).toString(36)})
					}
				};
			}
		});
	}, 250);
});