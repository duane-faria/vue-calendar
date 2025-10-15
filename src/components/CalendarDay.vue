<template>
  <div 
    class="calendar-day"
    :class="{
      'other-month': !day.isCurrentMonth,
      'today': day.isToday,
      'has-reminders': reminders.length > 0
    }"
  >
    <div class="day-header">
      <span class="day-number">{{ day.day }}</span>
      <button 
        v-if="reminders.length > 0" 
        @click.stop="$emit('delete-all', day.date)"
        class="delete-all-button"
        title="Delete all reminders"
      >
        🗑️
      </button>
    </div>
    
    <div class="reminders-container" @click="$emit('click')">
      <template v-if="reminders.length <= maxVisible">
        <ReminderItem
          v-for="reminder in reminders"
          :key="reminder.id"
          :reminder="reminder"
          @click="$emit('edit-reminder', reminder)"
          @delete="$emit('delete-reminder', reminder.id)"
        />
      </template>
      <template v-else>
        <ReminderItem
          v-for="reminder in reminders.slice(0, maxVisible - 1)"
          :key="reminder.id"
          :reminder="reminder"
          @click="$emit('edit-reminder', reminder)"
          @delete="$emit('delete-reminder', reminder.id)"
        />
        <div class="more-reminders" @click.stop="showAllReminders = !showAllReminders">
          +{{ reminders.length - (maxVisible - 1) }} more
        </div>
      </template>
    </div>

    <!-- Overflow Modal -->
    <div v-if="showAllReminders" class="overflow-modal" @click.stop="showAllReminders = false">
      <div class="overflow-content" @click.stop>
        <div class="overflow-header">
          <h3>{{ formatDate(day.date) }}</h3>
          <button @click="showAllReminders = false" class="close-button">✕</button>
        </div>
        <div class="overflow-reminders">
          <ReminderItem
            v-for="reminder in reminders"
            :key="reminder.id"
            :reminder="reminder"
            :expanded="true"
            @click="handleEdit(reminder)"
            @delete="handleDelete(reminder.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReminderItem from './ReminderItem.vue'
import { formatDate } from '../utils/dateUtils.ts'
import type { CalendarDay, Reminder } from '../types/index.ts'

interface Props {
  day: CalendarDay
  reminders: Reminder[]
}

const props = withDefaults(defineProps<Props>(), {
  reminders: () => []
})

const emit = defineEmits<{
  click: []
  'edit-reminder': [reminder: Reminder]
  'delete-reminder': [id: number]
  'delete-all': [date: string]
}>()

const showAllReminders = ref<boolean>(false)
const maxVisible = 3

function handleEdit(reminder: Reminder): void {
  showAllReminders.value = false
  emit('edit-reminder', reminder)
}

function handleDelete(id: number): void {
  emit('delete-reminder', id)
  if (props.reminders.length <= 1) {
    showAllReminders.value = false
  }
}
</script>

<style scoped>
.calendar-day {
  background: white;
  min-height: 120px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background: #f7fafc;
  transform: scale(1.02);
  z-index: 1;
}

.calendar-day.other-month {
  background: #f7fafc;
  opacity: 0.5;
}

.calendar-day.today {
  background: #ebf8ff;
  border: 2px solid #4299e1;
}

.calendar-day.has-reminders {
  background: #fffaf0;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.day-number {
  font-weight: 700;
  font-size: 16px;
  color: #2d3748;
}

.calendar-day.today .day-number {
  color: #2b6cb0;
}

.delete-all-button {
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
}

.calendar-day:hover .delete-all-button {
  opacity: 1;
}

.delete-all-button:hover {
  background: #fed7d7;
}

.reminders-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.more-reminders {
  padding: 6px 8px;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.more-reminders:hover {
  background: #5568d3;
  transform: scale(1.05);
}

.overflow-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.overflow-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.overflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.overflow-header h3 {
  font-size: 20px;
  color: #2d3748;
  margin: 0;
}

.close-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #718096;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f7fafc;
  color: #2d3748;
}

.overflow-reminders {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 80px;
    padding: 6px;
  }

  .day-number {
    font-size: 14px;
  }

  .delete-all-button {
    font-size: 12px;
  }
}
</style>
