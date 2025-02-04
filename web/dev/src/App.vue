<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import TaskEditor from './components/TaskEditor.vue'; 
import TodoEditor from './components/TodoEditor.vue';

const debug = ref("");
const debug2 = ref("");
const tasks = ref(null);
const selectedTask = ref(null);
const todos = ref(null);

const newTask = () => {
	axios.get('/todos/newTask')
	.then(res => {
		tasks.value.push(res.data);
	})
	.catch(err => console.log(err));
}

const newTodo = () => {
	axios.post('/todos/newTodo', {taskId: selectedTask.value.id})
	.then(res => {
		tasks.value = tasks.value.map(
			task => (task.id == selectedTask.value.id) ? res.data.task : task
		);
		todos.value.push(res.data.todo);
	})
	.catch(err => console.log(err));
};

const updateTask = (update) => {
	axios.post('/todos/setTitle', {taskId: update.taskId, title: update.title})
	.then(res => {
		tasks.value = tasks.value.map(
			task => (task.id == update.taskId) ? res.data : task
		)
		if(selectedTask.value && selectedTask.value.id == res.data.id) {
			selectedTask.value.title = res.data.title;
		}
	})
	.catch(err => console.log(err));
};

const updateTodoNote = (update) => {
	axios.post('/todos/setNote', {todoId: update.id, note: update.note})
	.then(res => {
		todos.value = todos.value.map(
			todo => (todo.id == update.id) ? res.data : todo
		);
	})
	.catch(err => console.log(err));
};

const updateTodoStatus = (todo) => {
	axios.post('/todos/setTodoStatus', {todoId: todo.id, done: todo.done})
	.then(res => {
		tasks.value = tasks.value.map(
			task => (task.id == res.data.task.id) ? res.data.task : task
		);
		todos.value = todos.value.map(
			todo => (todo.id == res.data.todo.id) ? res.data.todo : todo
		);
	})
	.catch(err => console.log(err));
}

const deleteTask = (update) => {
	axios.post('/todos/deleteTask', {taskId: update.taskId})
	.then(res => {
		tasks.value = tasks.value.filter(
			task => task.id != update.taskId
		)
		if(selectedTask.value && selectedTask.value.id == update.taskId) {
			todos.value = todos.value.filter(
				todo => false
			);
			selectedTask.value = null;
		}
	})
	.catch(err => console.log(err));
};

const deleteTodo = (todoId) => {
	axios.post('/todos/deleteTodo', {todoId: todoId})
	.then(res => {
		tasks.value = tasks.value.map(
			task => (task.id == res.data.task.id) ? res.data.task : task
		);
		todos.value = todos.value.filter(
			todo => todo.id != todoId
		);
	})
	.catch(err => console.log(err));
};

const selectTask = (task) => {
	axios.post('/todos/getTodos', {taskId: task.id})
	.then(res => {
		todos.value = res.data;
		selectedTask.value = task;
	})
	.catch(err => console.log(err));
};

watchEffect(() => {
	debug.value = tasks.value;
	debug2.value = todos.value;
});

onMounted(() => {
	axios.get('/todos/getTasks')
	.then((res) => {
		tasks.value = res.data;
	});	
});
</script>

<template>
	<div class="h-screen bg-main flex text-warmGray-400 text-xl">
		<TaskEditor
			:tasks="tasks"
			@new="newTask()"
			@select="task => selectTask(task)"
			@update="update => updateTask(update)"
			@delete="update => deleteTask(update)"
		/>
		<TodoEditor
			:task="selectedTask"
			:todos="todos"
			@new="newTodo()"
			@updateNote="todo => updateTodoNote(todo)"
			@updateStatus="todo => updateTodoStatus(todo)"
			@delete="todoId => deleteTodo(todoId)"
		/>
	</div>
</template>
<style>
</style>
