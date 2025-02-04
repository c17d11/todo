const express = require('express');
const { createTodoModel } = require('./src/todo.js');
const { createTaskModel } = require('./src/task.js');
var cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var corsOptions = {
	origin: function (origin, callback) {
		console.log(origin);
		callback()
	}
  }


// CREATE
app.get('/newTask', async (req, res) => {
	const modelTask = await createTaskModel();
	const result = await modelTask.newTask();
	if(!result) {
		res.status(500).json({err: "new task failed"});
		return;
	}
	res.status(200).json(result);
})

app.post('/newTodo', async (req, res) => {
	const taskId = req.body.taskId??null;
	if(taskId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	const modelTodo = await createTodoModel();
	const todoId = await modelTodo.newTodo(taskId);
	if(!todoId) {
		res.status(500).json({err: "new todo failed"});
		return;
	}
	const newTd = await modelTodo.getTodo(todoId); 
	const modelTask = await createTaskModel();
	const success   = await modelTask.addTodo(taskId);
	if(!success) {
		res.status(500).json({err: "update task failed"});
		return;
	}
	const updatedTsk = await modelTask.getTask(taskId);
	if(!updatedTsk) {
		res.status(500).json({err: "get task failed"});
		return;
	}
	res.status(200).json({todo: newTd, task: updatedTsk});
});

// READ
app.get('/getTasks', async (req, res) => {
	const modelTask = await createTaskModel();
	const result = await modelTask.getTasks();
	res.status(200).json(result);
});

app.post('/getTask', async (req, res) => {
	const taskId = req.body.taskId??null;
	if(taskId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	const modelTask = await createTaskModel();
	const result = await modelTask.getTask(taskId);
	res.status(200).json(result);	
});

app.post('/getTodos', async (req, res) => {
	const taskId = req.body.taskId??null;
	if(taskId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	const modelTodo = await createTodoModel();
	const result = await modelTodo.getTodos(taskId);
	res.status(200).json(result);
});

app.post('/getTodo', async (req, res) => {
	const todoId = req.body.todoId??null;
	if(todoId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	const modelTodo = await createTodoModel();
	const result = await modelTodo.getTodo(todoId);
	res.status(200).json(result);
});

// UPDATE
app.post('/setTitle', async (req, res) => {
	const taskId = req.body.taskId??null;
	if(taskId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	const title = req.body.title??null;
	if(title === null) {
		res.status(500).json({err: "no title"});
		return;
	}
	const modelTask = await createTaskModel();
	const result = await modelTask.setTitle(taskId, title);
	if(!result) {
		res.status(500).json({err: "update failed"});
		return;
	}
	const updatedTask = await modelTask.getTask(taskId);
	res.status(200).json(updatedTask);
});

app.post('/setTodoStatus', async (req, res) => {
	const todoId = req.body.todoId??null;
	if(todoId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	const done = req.body.done??null;
	if(typeof done != "boolean") {
		res.status(500).json({err: "invalid status"});
		return;
	}
	const modelTodo = await createTodoModel();
	const result    = await modelTodo.setStatus(todoId, done);
	if(!result) {
		res.status(500).json({err: "failed update todo status"});
		return;
	}
	const taskId = await modelTodo.getTaskId(todoId);
	const modelTask = await createTaskModel();
	let result2;
	if(done) {
		result2 = await modelTask.addDoneTodo(taskId);
	} else {
		result2 = await modelTask.removeDoneTodo(taskId);
	}
	if(!result2) {
		res.status(500).json({err: "failed update task"});
		return;
	}
	const updatedTd = await modelTodo.getTodo(todoId);
	const updatedTsk = await modelTask.getTask(taskId);
	res.status(200).json({task: updatedTsk, todo: updatedTd});
});

app.post('/setNote', async (req, res) => {
	const todoId = req.body.todoId??null;
	const note = req.body.note??null;
	if(todoId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	if(note === null) {
		res.status(500).json({err: "invalid note"});
		return;
	}
	const modelTodo = await createTodoModel();
	const result = await modelTodo.setNote(todoId, note);
	if(!result) {
		res.status(500).json({err: "failed update note"});
		return;
	}
	const updatedTd = await modelTodo.getTodo(todoId);
	res.status(200).json(updatedTd);
})

// DELETE
app.post('/deleteTask', async (req, res) => {
	const taskId = req.body.taskId??null;
	if(taskId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	const modelTask = await createTaskModel();
	const result    = await modelTask.deleteTask(taskId);
	if(!result) {
		res.status(500).json({err: "delete task failed"});
		return;
	}
	const modelTodo = await createTodoModel();
	const result2   = await modelTodo.deleteTodos(taskId);
	if(!result2) {
		res.status(500).json({err: "delete todos failed"});
		return;
	}
	res.status(200).json(true);
});

app.post('/deleteTodo', async (req, res) => {
	const todoId = req.body.todoId??null;
	if(todoId === null) {
		res.status(500).json({err: "invalid id"});
		return;
	}
	const modelTodo = await createTodoModel();
	const taskId = await modelTodo.getTaskId(todoId);
	if(!taskId) {
		res.status(500).json({err: "get taskid failed"});
		return;
	}
	const result = await modelTodo.deleteTodo(todoId);
	if(!result) {
		res.status(500).json({err: "delete todo failed"});
		return;
	}
	const modelTask = await createTaskModel();
	const result2   = await modelTask.removeTodo(taskId);
	if(!result2) {
		res.status(500).json({err: "update task failed"});
		return;
	}
	const updatedTsk = await modelTask.getTask(taskId);
	res.status(200).json({task: updatedTsk});
});

app.get('/hhh', (req, res) => {
		res.status(200).json({message: "hello"});
});

const port = process.env.BACKEND_PORT || 3333;
app.listen(port, () => console.log(`Server listening on port ${port}`));
