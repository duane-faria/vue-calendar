<template>
  <div class="app-container">
    <header class="app-header">
      <h1>📅 Calendar App</h1>
      <p>Manage your reminders with weather forecasts</p>
    </header>
    <Calendar />
  </div>
</template>

<script setup>
import Calendar from './components/Calendar.vue'
</script>

<style scoped>
.app-container {
  width: 100%;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.app-header p {
  font-size: 1.1rem;
  opacity: 0.95;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-header p {
    font-size: 1rem;
  }
}
</style>
