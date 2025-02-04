const { connectDatabase }    = require('./database.js');
const { createCounterModel } = require('./counter.js');

class Todo {
	#dbCollection;
	#modelCounter;

	constructor(db, modelCounter) {
		this.#dbCollection = db.todos;
		this.#modelCounter = modelCounter;
	}

	// CREATE
	async newTodo(taskId) {
		const todoId = await this.#modelCounter.increaseCount("todo");

		const todo = {
			id     : todoId,
			done   : false,
			note   : "",
			taskId : taskId
		};
		const success = await this.#dbCollection.insertOne(todo)
			.then(r => r.acknowledged);
		return success ? todoId : succes;
	}

	// READ
	async getTodos(taskId) {
		const res = await this.#dbCollection.find({taskId: taskId}, {projection: {_id: 0}}).toArray();
		return res;
	}

	async getTodo(todoId) {
		const res = await this.#dbCollection.findOne({id: todoId}, {projection: {_id: 0}});
		return res;
	}

	async getTaskId(todoId) {
		const res = await this.#dbCollection.findOne({id: todoId}, {projection: {_id: 0, taskId:1}})
		return res ? res.taskId : null;
	}
 
	// UPDATE
	async setStatus(todoId, done) {
		const success = await this.#dbCollection.updateOne({id: todoId}, {$set: {done: done}})
			.then(r => r.acknowledged);
		return success;
	}

	async setNote(todoId, note) {
		const success = await this.#dbCollection.updateOne({id: todoId}, {$set: {note: note}})
			.then(r => r.acknowledged);
		return success;
	}

	// DELETE
	async deleteTodos(taskId) {
		const success = await this.#dbCollection.deleteMany({taskId: taskId})
			.then(r => r.acknowledged);
		return success;
	}

	async deleteTodo(todoId) {
		const success = await this.#dbCollection.deleteOne({id: todoId})
			.then(r => r.acknowledged);
		return success;
	}
}

async function createTodoModel() {
	const db = await connectDatabase();
	const counter = await createCounterModel();
	const task = new Todo(db, counter);
	return task;
}

module.exports = { createTodoModel };
