<script setup>
// import Task from './Task.vue';
import axios from 'axios';
import { Add } from '@vicons/ionicons5';
import Task from './Task.vue';
import { ref, onMounted, watchEffect, watch } from 'vue';

// watchEffect(() => {
// 	if(props.refreshTask) {
// 		refreshTask(props.refreshTask)
// 		props.refreshTask = null;
// 	}
// });

const props = defineProps([
	'tasks'
]);

const emits = defineEmits([
	'new',
	'select',
	'update',
	'delete'
]);

const debug = ref('');
const tasks = ref([]);

watchEffect(() => {
	tasks.value = props.tasks;
	debug.value = props.tasks;
});
</script>
<template>
	<div class="flex flex-col flex-grow h-full border-r-2 border-main_d">
		<div class="flex bg-sec_d border-b-2 border-main_d py-4 px-2 h-20">
			<Add
				class="h-12 px-2 text-accent hover:scale-125"
				@click="$emit('new')">
			</Add>
		</div>
		<div class="flex-grow w-full no-scrollbar overflow-y-auto">
			<!-- <div v-if="debug">{{  debug }}</div> -->
			<Task
				class="bg-main_l outline outline-0 hover:outline-sec_d hover:outline-2 rounded-xl m-4"
				v-for="task in tasks"
				:key="task.id"
				:task="task"
				@click="$emit('select', task)"
				@update="title => {debug=title; $emit('update', {taskId: task.id, title: title});}"
				@delete="$emit('delete', {taskId: task.id})"
			/>
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