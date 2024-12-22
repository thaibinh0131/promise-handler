<script setup lang="ts">
import Posts from './components/Posts.vue';
import Comments from './components/Comments.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const tab = ref('post');
const route = useRoute();
const router = useRouter();
function changeTab(value: string) {
  tab.value = value;
  router.push(`/?tab=${value}`);
}

function init() {
  const queryTab = route.query.tab;
  tab.value = queryTab || 'post';
}
init();
</script>

<template>
  <div>
    {{ route.fullPath }}
    <button @click="changeTab('post')">Show Posts</button>
    <button @click="changeTab('comment')">Show Comments</button>
  </div>
  <Posts v-if="tab === 'post'" />
  <Comments v-else-if="tab === 'comment'" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
