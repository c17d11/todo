const { connectDatabase } = require('./database.js');

class Counter {
	#dbCollection;

	constructor(db) {
		this.#dbCollection = db.counters;
	}

	// CREATE
	async #new(name) {
		const counter = {
			name : name,
			count: 1
		};

		const success = await this.#dbCollection.insertOne(counter)
			.then(r => r.acknowledged);
		return success;
	}

	// READ
	async #getCount(name) {
		const count = await this.#dbCollection.findOne({name: name}, {projection: {_id: 0 , count: 1}})
			.then(r => r ? r.count : 0);
		return count;
	}

	// UPDATE
	async #setCount(name, count) {
		const success = await this.#dbCollection.updateOne({name: name}, {$set: {count: count}})
			.then(r => r.acknowledged);
		return success;
	}

	async increaseCount(name) {
		const newCount = await this.#getCount(name) + 1;
		let success;
		if(newCount == 1) {
			success = await this.#new(name);
		} else {
			success = await this.#setCount(name, newCount)
		}
		return success ? newCount : success;
	}

	// DELETE
}

async function createCounterModel() {
	const db = await connectDatabase();
	const counter = new Counter(db);
	return counter;
}

module.exports = { createCounterModel };