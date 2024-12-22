<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuery } from '../composables/useQuery.ts';
import { useRouteQuery } from '../composables/useRouteQuery';

const { getQueryValue, navigateTo } = useRouteQuery();

const postId = ref(
	getQueryValue({
		queryKey: 'postId',
		defaultValue: undefined,
		parse: (val) => Number(val),
	})
);
const { data: comments, isLoading, execute, refresh } = useQuery({
	key: 'comments',
	promiseFn: async (id?: number) => {
		const data = await fetch(
			id
				? `https://jsonplaceholder.typicode.com/comments?postId=${id}`
				: 'https://jsonplaceholder.typicode.com/comments'
		);
		return data.json();
	},
});
execute(postId.value);

watch(postId, (id) => {
	if (id) {
		refresh(id);
		navigateTo({ postId: id });
	}
});
</script>

<template>
	<h1>This is comments</h1>
	<div class="ids">
		<button
			v-for="i in 4"
			@click="postId = i"
			:class="{
				active: postId === i,
			}"
		>
			{{ i }}
		</button>
	</div>
	<div class="post-wrapper">
		<div v-for="comment in comments" :key="comment.id" class="card">
			<p>
				{{ comment.name }}
			</p>
		</div>
	</div>
</template>

<style scoped>
.post-wrapper {
	height: 400px;
	overflow-y: auto;
}

.ids {
	display: flex;
	gap: 8px;
}
.active {
	background: blue;
}
</style>
