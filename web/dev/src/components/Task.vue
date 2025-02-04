<script setup>
import { ref, watchEffect } from 'vue';
import { DeleteOutlined, SaveFilled, EditOffFilled, EditFilled } from '@vicons/material';
import { computed } from '@vue/reactivity';

const props = defineProps([
	"task"
]);

const emits = defineEmits([
	'select',
	'update',
	'delete'
]);

const debug = ref("");
const doEdit = ref(false);
const newTitle = ref("");
const showDeleteModal = ref(false);
const task = ref(null);
const progress = computed(() => {
	if(task.value.n_todos == 0) {
		return "0%";
	} else {
		return Math.ceil((task.value.n_done / task.value.n_todos) * 100) + "%";
	}
});

watchEffect(() => {
	task.value = props.task;
});
</script>

<template>
<div>
	<div 
		class="flex flex-col mx-0 my-0"
		v-bind="$attrs" 
		:class="{'z-20': doEdit, relative: doEdit}"
		>
		<div class="flex flex-row">
			<p class="text-left my-4 mx-8 w-full text-xl" :class="{hidden: doEdit}">{{ task.title??"" }}</p>
			<input 
				class="text-left w-full my-2 mx-4 bg-transparent outline-accent outline outline-2 rounded-2xl px-4"
				placeholder="Enter new title" 
				:class="{hidden: !doEdit}"
				v-model="newTitle"
				@click.stop=""
			/>
			<div class="flex ml-auto m-2">
				<div class="flex items-center h-10">
					<button
					type="button"
					@click.stop="showDeleteModal=true"
					class="hover:scale-125">
						<DeleteOutlined class="h-8 w-8 text-sec_l" :class="{hidden: doEdit}"/>
					</button>
					<button
					type="button"
					@click.stop="{doEdit=false; debug=newTitle; $emit('update', newTitle);}"
					class="hover:scale-125">
						<SaveFilled class="h-8 w-8 text-accent" :class="{hidden: !doEdit}"/>
					</button>
					<button
					type="checkbox"
					checked="done"
					@click.stop="doEdit=!doEdit"
					class="p-4 pl-4 hover:scale-125">
						<EditFilled class="h-8 w-8 text-sec_l" :class="{hidden: doEdit}"/>
						<EditOffFilled class="h-8 w-8 text-accent" :class="{hidden: !doEdit}"/>
					</button>
				</div>
			</div>
		</div>
		<div class="flex flex-row h-10 m-2">
			<div class="bg-main w-1/2 m-2 ml-auto rounded-md">
				<div class="progress-bar rounded-md h-full from-sec_l bg-sec_l bg-gradient-to-r" :style="{width: progress }"></div>
			</div>
		</div>
		<!-- <div v-if="debug">{{ debug }}</div> -->
	</div>
	<div @click.self.stop="showDeleteModal=false" class="z-40 fixed overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full bg-opacity-70 bg-main" :hidden="!showDeleteModal">
		<div class="z-50 p-3 mx-auto my-2 w-3/12 max-w-full bg-main_l rounded-lg border-2 border-main_d">
			<div class="text-center py-6 text-2xl">Are you sure?</div>
			<div class="text-center font-light mb-8">
				Do you really want to delete this task? This process cannot be undone.
			</div>
			<div class="flex justify-center">
				<button @click.stop="showDeleteModal=false"
					class="bg-main rounded hover:bg-main_d px-6 py-2 focus:outline-none mx-1">Cancel</button>
				<button @click.stop="{showDeleteModal=false; debug='deleted'; $emit('delete')}"
					class="bg-sec_l text-gray-200 rounded hover:bg-sec_d px-6 py-2 focus:outline-none mx-1">Delete</button>
			</div>
		</div>
	</div>
	<div @click.self.stop="doEdit=false" class="z-10 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-opacity-70 bg-main" :hidden="!doEdit">
	</div>
</div>
</template>
<style>
</style>