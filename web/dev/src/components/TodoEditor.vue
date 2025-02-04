<script setup>
import axios from 'axios';
import { ref, onMounted, watchEffect } from 'vue';
import Todo from './Todo.vue';
import { Checkmark, ArrowBack, Add } from '@vicons/ionicons5';

const props = defineProps([
	"task",
	"todos"
]);

const emits = defineEmits([
	"new",
	"updateNote",
	"updateStatus",
	"delete"
]);

const debug = ref("");
const debug2 = ref("");
const task = ref(null);
const todos = ref(null);
const editTodo = ref("");

watchEffect(() => {
	task.value  = props.task;
	todos.value = props.todos;
	debug.value = editTodo.value;
	// debug2.value = props.task;
	
	if(todos.value) {
		todos.value.sort((a, b) => {
			if( (a.done && b.done) || (!a.done && !b.done) ) {
				// sames status. Lowest id first
				return a.id > b.id ? 1 : -1;
			} else {
				// Different status -> not done first
				return a.done ? 1 : -1;
			}
		});
	}
});
</script>
<template>
	<div class="h-full w-1/2">
		<div class="flex flex-col h-full w-full border-l-2 border-main_d" v-bind:class="{hidden: editTodo}">
			<div class="flex bg-sec_d border-b-2 border-main_d py-4 px-2 h-20">
				<Add
					class="h-12 px-2 text-accent hover:scale-125"
					:class="{hidden: !task}"
					@click="$emit('new')">
				</Add>
				<p class="text-center my-2 mx-4 w-full">{{ task ? task.title : "" }}</p>
			</div>
			<div class="flex-grow w-full no-scrollbar overflow-y-auto">
				<!-- <div v-if="debug">{{ debug }}</div> -->
				<!-- <div v-if="debug2">{{ debug2 }}</div> -->
				<Todo
					class="bg-main_l outline outline-0 hover:outline-sec_d hover:outline-2 rounded-lg m-4" 
					v-for="todo in todos"
					:key="todo.id"
					@delete="$emit('delete', todo.id)"
					@doEdit="editTodo=todo"
					@isDone="todo => $emit('updateStatus', todo)"
					:todo="todo">
				</Todo>
			</div>
		</div>
			
		<div class="flex flex-col h-full w-full border-l-2 border-main_d" v-bind:class="{hidden: !editTodo}">
			<div class="bg-sec_d border-b-2 border-main_d items-center flex py-4 px-2 h-20">
				<ArrowBack
					class="h-12 px-2 text-accent hover:scale-125"
					@click="editTodo = null">
				</ArrowBack>
				<Checkmark
					class="h-12 px-2 ml-2 text-accent hover:scale-125"
					@click="{$emit('updateNote', editTodo); editTodo = null;}">
				</Checkmark>
			</div>
				<textarea v-if="editTodo"
					class="py-4 px-8 w-full h-full bg-main_l focus:outline focus:outline-sec_l focus:outline-2"
					v-model="editTodo.note">
				</textarea>
		</div>
	</div>
</template>
<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>