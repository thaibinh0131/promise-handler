<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '../composables/useQuery.ts';

const {
  data: posts,
  isLoading,
  execute,
} = useQuery({
  key: 'posts',
  promiseFn: async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts');
    return data.json();
  },
});
execute();
</script>

<template>
  <h1>This is posts</h1>
  <div class="post-wrapper">
    <div v-for="post in posts" :key="post.id" class="card">
      <p>
        {{ post.title }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.post-wrapper {
  height: 400px;
  overflow-y: auto;
}
</style>
