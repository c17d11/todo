const { connectDatabase }    = require('./database.js');
const { createCounterModel } = require('./counter.js');

class Task {
	#dbCollection;
	#modelCounter;

	constructor(db, modelCounter) {
		this.#dbCollection = db.tasks;
		this.#modelCounter = modelCounter;
	}

	// CREATE
	async newTask() {
		const taskId = await this.#modelCounter.increaseCount("task");

		const task = {
			id       : taskId,
			title    : "New Task",
			n_todos  : 0,
			n_done   : 0
		};
		const success = await this.#dbCollection.insertOne(task)
			.then(r => r.acknowledged);
		return success ? task : success;
	}

	// READ
	async getTasks() {
		const res = await this.#dbCollection.find({}, {projection: {_id: 0}}).toArray();
		return res;
	}

	async getTask(taskId) {
		const res = await this.#dbCollection.findOne({id: taskId}, {projection: {_id: 0}});
		return res;
	}

	// UPDATE
	async addTodo(taskId) {
		const success = await this.#dbCollection.updateOne({id: taskId}, {$inc: {n_todos: 1}})
			.then(r => r.acknowledged);
		return success;
	}

	async removeTodo(taskId) {
		const success = await this.#dbCollection.updateOne({id: taskId}, {$inc: {n_todos: -1}})
			.then(r => r.acknowledged);
		return success;
	}

	async addDoneTodo(taskId) {
		const success = await this.#dbCollection.updateOne({id: taskId}, {$inc: {n_done: 1}})
			.then(r => r.acknowledged);
		return success;
	}

	async removeDoneTodo(taskId) {
		const success = await this.#dbCollection.updateOne({id: taskId}, {$inc: {n_done: -1}})
			.then(r => r.acknowledged);
		return success;
	}

	async setTitle(taskId, title) {
		const success = await this.#dbCollection.updateOne({id: taskId}, {$set: {title: title}})
			.then(r => r.acknowledged);
		return success;
	}

	// DELETE
	async deleteTask(taskId) {
		const success = await this.#dbCollection.deleteOne({id: taskId})
			.then(r => r.acknowledged);
		return success;
	}
}

async function createTaskModel() {
	const db = await connectDatabase();
	const counter = await createCounterModel();
	const task = new Task(db, counter);
	return task;
}

module.exports = { createTaskModel };
