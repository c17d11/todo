<script setup>
import { computed, ref, watchEffect } from 'vue';
import { CircleOutlined, CheckCircleOutlined, DeleteOutlined } from '@vicons/material';

const props = defineProps([
	"todo"
]);

const emits = defineEmits([
	'delete',
	'doEdit',
	'isDone'
]);

const todo = ref(null);
watchEffect(() => {
	todo.value = props.todo;
});

const done = computed(() => 
	todo.value ? todo.value.done : false
);
const displayNote = computed(() => 
	(todo.value && todo.value.note) ? todo.value.note : "Empty note"
);
const showDeleteModal = ref(false);
</script>

<template>
<div>
	<div class="flex flex-row bg-main_l mx-0 my-0 text-lg" :class="$attrs.class" @click="{if(!done) $emit('doEdit');}">
		<pre class="text-left py-4 px-8 overflow-x-auto" :class="{hidden: done}">{{ displayNote }}</pre>
		<del class="text-left py-4 px-8 overflow-x-auto" :class="{hidden: !done}">{{ displayNote }}</del>
		<div class="flex ml-auto my-2">
			<div class="flex items-center h-10">
				<button
				type="checkbox"
				checked="done"
				@click.stop="showDeleteModal=true"
				class="p-2"
				:class="{'hover:scale-125': !done}"
				:disabled="done">
					<DeleteOutlined class="h-8 w-8 text-sec_l" :class="{'text-main': done}"/>
				</button>
				<button
				type="checkbox"
				checked="done"
				@click.stop="{todo.done=!done; $emit('isDone', todo)}"
				class="p-2 mr-4 hover:scale-125">
					<CircleOutlined class="h-8 w-8 text-sec_l" :class="{hidden: done}"/>
					<CheckCircleOutlined class="h-8 w-8 text-accent" :class="{hidden: !done}"/>
				</button>
			</div>
		  </div>
	</div>
	<div @click.self.stop="showDeleteModal=false" class="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-opacity-70 bg-main" :hidden="!showDeleteModal">
		<div class="z-50 relative p-3 mx-auto my-2 w-3/12 max-w-full bg-main_l rounded-lg border-2 border-main_d">
			<div class="text-center py-6 text-2xl">Are you sure ?</div>
			<div class="text-center font-light mb-8">
				Do you really want to delete this todo? This process cannot be undone.
			</div>
			<div class="flex justify-center">
				<button @click.stop="showDeleteModal=false"
					class="bg-main rounded hover:bg-main_d px-6 py-2 focus:outline-none mx-1">Cancel</button>
				<button @click.stop="{showDeleteModal=false; $emit('delete')}"
					class="bg-sec_l text-gray-200 rounded hover:bg-sec_d px-6 py-2 focus:outline-none mx-1">Delete</button>
			</div>
		</div>
	</div>
</div>
</template>

<style>
</style>