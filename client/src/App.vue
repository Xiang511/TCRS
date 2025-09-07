<template>
  <main class="container">
    <h1>TCRS Vue3 + Express 範例</h1>
    <p>後端健康狀態： <strong>{{ healthStatus }}</strong></p>
    <button @click="loadHealth">重新取得</button>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const healthStatus = ref('載入中...');

async function loadHealth() {
  try {
    const { data } = await axios.get('http://localhost:3000/api/health');
    healthStatus.value = data.status + ' (' + new Date(data.timestamp).toLocaleTimeString() + ')';
  } catch (e) {
    healthStatus.value = '無法連線';
  }
}

onMounted(loadHealth);
</script>

<style scoped>
.container { font-family: system-ui, sans-serif; padding: 2rem; }
button { padding: 0.5rem 1rem; cursor: pointer; }
</style>
