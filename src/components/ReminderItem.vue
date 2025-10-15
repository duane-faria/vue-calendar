<template>
  <div 
    class="reminder-item"
    :class="{ expanded }"
    :style="{ borderLeftColor: reminder.color }"
  >
    <div class="reminder-content">
      <div class="reminder-header">
        <span class="reminder-time">{{ reminder.time }}</span>
        <div class="action-buttons">
          <button 
            @click.stop="$emit('click')"
            class="edit-button"
            title="Edit reminder"
          >
            ✏️
          </button>
          <button 
            @click.stop="$emit('delete')"
            class="delete-button"
            title="Delete reminder"
          >
            ✕
          </button>
        </div>
      </div>
      <div class="reminder-text">{{ reminder.text }}</div>
      <div class="reminder-footer">
        <span class="reminder-city">📍 {{ reminder.city }}</span>
        <span v-if="reminder.weather" class="reminder-weather" :title="reminder.weather.description">
          {{ reminder.weather.description }} {{ reminder.weather.temp }}°C
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reminder } from '../types'

interface Props {
  reminder: Reminder
  expanded?: boolean
}

withDefaults(defineProps<Props>(), {
  expanded: false
})

defineEmits<{
  click: []
  delete: []
}>()
</script>

<style scoped>
.reminder-item {
  background: white;
  border-left: 4px solid;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.reminder-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.reminder-item.expanded {
  padding: 12px;
}

.reminder-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reminder-time {
  font-size: 11px;
  font-weight: 700;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.expanded .reminder-time {
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
}

.edit-button,
.delete-button {
  opacity: 0;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
}

.edit-button {
  color: #3b82f6;
}

.delete-button {
  color: #e53e3e;
}

.reminder-item:hover .edit-button,
.reminder-item:hover .delete-button {
  opacity: 1;
}

.edit-button:hover {
  background: #dbeafe;
  transform: scale(1.1);
}

.delete-button:hover {
  background: #fed7d7;
  transform: scale(1.1);
}

.reminder-text {
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.4;
  word-break: break-word;
}

.expanded .reminder-text {
  font-size: 14px;
}

.reminder-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.reminder-city {
  font-size: 11px;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 2px;
}

.expanded .reminder-city {
  font-size: 12px;
}

.reminder-weather {
  font-size: 11px;
  color: #4299e1;
  font-weight: 600;
  background: #ebf8ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.expanded .reminder-weather {
  font-size: 12px;
  padding: 4px 8px;
}

@media (max-width: 768px) {
  .reminder-item {
    padding: 6px;
  }

  .reminder-text {
    font-size: 12px;
  }

  .reminder-time,
  .reminder-city,
  .reminder-weather {
    font-size: 10px;
  }

  /* Show buttons on mobile without hover */
  .edit-button,
  .delete-button {
    opacity: 0.7;
  }

  .edit-button:active,
  .delete-button:active {
    opacity: 1;
  }
}
</style>
