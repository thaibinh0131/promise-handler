<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '../composables/useQuery.ts';

const {
  data: comments,
  isLoading,
  execute,
} = useQuery({
  key: 'comments',
  promiseFn: async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/comments');
    return data.json();
  },
});
execute();
</script>

<template>
  <h1>This is comments</h1>
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
</style>
