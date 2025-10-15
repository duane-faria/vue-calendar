<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ reminder ? 'Edit Reminder' : 'Add Reminder' }}</h2>
        <button @click="$emit('close')" class="close-button">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="text">Reminder Text <span class="char-count">({{ formData.text.length }}/30)</span></label>
          <input
            id="text"
            v-model="formData.text"
            type="text"
            maxlength="30"
            required
            placeholder="Enter reminder text..."
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Date</label>
            <input
              id="date"
              v-model="formData.date"
              type="date"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="time">Time</label>
            <input
              id="time"
              v-model="formData.time"
              type="time"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="city">City</label>
          <input
            id="city"
            v-model="formData.city"
            type="text"
            required
            placeholder="Enter city name..."
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Color</label>
          <div class="color-picker">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              class="color-option"
              :class="{ selected: formData.color === color }"
              :style="{ backgroundColor: color }"
              @click="formData.color = color"
            >
              <span v-if="formData.color === color" class="checkmark">✓</span>
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="cancel-button">
            Cancel
          </button>
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? 'Saving...' : (reminder ? 'Update' : 'Add') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import type { Reminder, ReminderFormData } from '../types'

interface Props {
  date: string | null
  reminder: Reminder | null
}

const props = withDefaults(defineProps<Props>(), {
  reminder: null
})

const emit = defineEmits<{
  close: []
  save: [data: ReminderFormData]
}>()

const loading = ref<boolean>(false)

const colors: string[] = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
]

const formData = reactive<ReminderFormData>({
  text: '',
  date: props.date || '',
  time: '12:00',
  city: '',
  color: colors[0]
})

onMounted(() => {
  if (props.reminder) {
    formData.text = props.reminder.text
    formData.date = props.reminder.date
    formData.time = props.reminder.time
    formData.city = props.reminder.city
    formData.color = props.reminder.color
  } else {
    // Set default time to current time rounded to next hour
    const now = dayjs()
    formData.time = now.add(1, 'hour').startOf('hour').format('HH:mm')
  }
})

async function handleSubmit(): Promise<void> {
  loading.value = true
  try {
    emit('save', { ...formData })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 24px;
  color: #2d3748;
  margin: 0;
}

.close-button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #718096;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f7fafc;
  color: #2d3748;
}

.modal-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

.char-count {
  color: #718096;
  font-weight: 400;
  font-size: 12px;
}

.form-input {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.color-picker {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.color-option {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  border: 3px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.color-option.selected {
  border-color: #2d3748;
  transform: scale(1.15);
}

.checkmark {
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.cancel-button,
.submit-button {
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
}

.cancel-button {
  background: #f7fafc;
  color: #4a5568;
}

.cancel-button:hover {
  background: #e2e8f0;
}

.submit-button {
  background: #667eea;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 100%;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .modal-form {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .color-picker {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
