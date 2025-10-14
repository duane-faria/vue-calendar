<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="navigation">
        <button
          @click="store.previousMonth()"
          class="nav-button"
          title="Previous month"
        >
          ‹
        </button>
        <button @click="store.goToToday()" class="today-button">Today</button>
        <button
          @click="store.nextMonth()"
          class="nav-button"
          title="Next month"
        >
          ›
        </button>
      </div>

      <div class="date-selectors">
        <select
          v-model="selectedMonth"
          @change="onMonthChange"
          class="month-select"
        >
          <option
            v-for="month in months"
            :key="month.value"
            :value="month.value"
          >
            {{ month.label }}
          </option>
        </select>
        <select
          v-model="selectedYear"
          @change="onYearChange"
          class="year-select"
        >
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>

    <div class="calendar-grid">
      <div v-for="day in dayNames" :key="day" class="day-header">
        {{ day }}
      </div>

      <CalendarDay
        v-for="day in calendarDays"
        :key="day.date"
        :day="day"
        :reminders="store.getRemindersForDate(day.date)"
        @click="openReminderModal(day.date)"
        @edit-reminder="editReminder"
        @delete-reminder="deleteReminder"
        @delete-all="deleteAllReminders"
      />
    </div>

    <ReminderModal
      v-if="showModal"
      :date="selectedDate"
      :reminder="editingReminder"
      @close="closeModal"
      @save="saveReminder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useCalendarStore } from "../stores/calendar.ts";
import {
  getCalendarDays,
  getDayNames,
  getMonths,
  getYearRange,
} from "../utils/dateUtils.ts";
import CalendarDay from "./CalendarDay.vue";
import ReminderModal from "./ReminderModal.vue";
import type { Reminder, ReminderFormData } from "../types/index.ts";

const store = useCalendarStore();

// State
const showModal = ref<boolean>(false);
const selectedDate = ref<string | null>(null);
const editingReminder = ref<Reminder | null>(null);
const selectedMonth = ref<number>(store.currentMonth);
const selectedYear = ref<number>(store.currentYear);

// Computed
const dayNames = getDayNames();
const months = getMonths();
const years = getYearRange(2020, 2030);

const calendarDays = computed(() => {
  return getCalendarDays(store.currentYear, store.currentMonth);
});

// Watch for store changes
watch(
  () => store.currentMonth,
  (newMonth: number) => {
    selectedMonth.value = newMonth;
  }
);

watch(
  () => store.currentYear,
  (newYear: number) => {
    selectedYear.value = newYear;
  }
);

// Methods
function onMonthChange(): void {
  store.setMonth(selectedMonth.value);
}

function onYearChange(): void {
  store.setYear(selectedYear.value);
}

function openReminderModal(date: string): void {
  selectedDate.value = date;
  editingReminder.value = null;
  showModal.value = true;
}

function editReminder(reminder: Reminder): void {
  selectedDate.value = reminder.date;
  editingReminder.value = reminder;
  showModal.value = true;
}

function closeModal(): void {
  showModal.value = false;
  selectedDate.value = null;
  editingReminder.value = null;
}

async function saveReminder(reminderData: ReminderFormData): Promise<void> {
  if (editingReminder.value) {
    await store.updateReminder(editingReminder.value.id, reminderData);
  } else {
    await store.addReminder(reminderData);
  }
  closeModal();
}

function deleteReminder(id: number): void {
  store.deleteReminder(id);
}

function deleteAllReminders(date: string): void {
  store.deleteAllRemindersForDate(date);
}
</script>

<style scoped>
.calendar-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 30px;
  max-width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.navigation {
  display: flex;
  gap: 10px;
  align-items: center;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #667eea;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-weight: bold;
}

.nav-button:hover {
  background: #5568d3;
  transform: scale(1.05);
}

.today-button {
  padding: 10px 20px;
  border-radius: 8px;
  background: #48bb78;
  color: white;
  font-weight: 600;
  transition: all 0.2s;
}

.today-button:hover {
  background: #38a169;
  transform: scale(1.05);
}

.date-selectors {
  display: flex;
  gap: 10px;
}

.month-select,
.year-select {
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.month-select:hover,
.year-select:hover {
  border-color: #667eea;
}

.month-select:focus,
.year-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.day-header {
  background: #f7fafc;
  padding: 15px;
  text-align: center;
  font-weight: 700;
  color: #4a5568;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 15px;
  }

  .calendar-header {
    flex-direction: column;
    align-items: stretch;
  }

  .navigation {
    justify-content: center;
  }

  .date-selectors {
    justify-content: center;
  }

  .day-header {
    padding: 10px 5px;
    font-size: 12px;
  }

  .nav-button {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  .today-button {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
