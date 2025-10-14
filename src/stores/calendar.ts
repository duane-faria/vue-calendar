import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { getWeatherForecast } from '../services/weatherService'
import type { Reminder, ReminderFormData, RemindersByDate } from '../types'

// Local storage keys
const STORAGE_KEY_REMINDERS = 'calendar_reminders'
const STORAGE_KEY_NEXT_ID = 'calendar_next_id'

// Local storage utilities
function loadRemindersFromStorage(): Reminder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_REMINDERS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load reminders from storage:', error)
    return []
  }
}

function loadNextIdFromStorage(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_NEXT_ID)
    return stored ? parseInt(stored, 10) : 1
  } catch (error) {
    console.error('Failed to load next ID from storage:', error)
    return 1
  }
}

function saveRemindersToStorage(reminders: Reminder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders))
  } catch (error) {
    console.error('Failed to save reminders to storage:', error)
  }
}

function saveNextIdToStorage(nextId: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_NEXT_ID, nextId.toString())
  } catch (error) {
    console.error('Failed to save next ID to storage:', error)
  }
}

export const useCalendarStore = defineStore('calendar', () => {
  // State - Load from local storage
  const reminders = ref<Reminder[]>(loadRemindersFromStorage())
  const currentMonth = ref<number>(dayjs().month())
  const currentYear = ref<number>(dayjs().year())
  const nextId = ref<number>(loadNextIdFromStorage())

  // Watch reminders and save to local storage on changes
  watch(
    reminders,
    (newReminders) => {
      saveRemindersToStorage(newReminders)
    },
    { deep: true }
  )

  // Watch nextId and save to local storage on changes
  watch(nextId, (newNextId) => {
    saveNextIdToStorage(newNextId)
  })

  // Getters
  const remindersByDate = computed<RemindersByDate>(() => {
    const grouped: RemindersByDate = {}
    
    reminders.value.forEach(reminder => {
      if (!grouped[reminder.date]) {
        grouped[reminder.date] = []
      }
      grouped[reminder.date].push(reminder)
    })
    
    // Sort reminders by time for each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time))
    })
    
    return grouped
  })

  const getRemindersForDate = computed(() => {
    return (date: string): Reminder[] => remindersByDate.value[date] || []
  })

  // Actions
  async function addReminder(reminderData: ReminderFormData): Promise<Reminder> {
    const newReminder: Reminder = {
      id: nextId.value++,
      text: reminderData.text.substring(0, 30), // Max 30 chars
      date: reminderData.date,
      time: reminderData.time,
      city: reminderData.city,
      color: reminderData.color,
      weather: null
    }

    // Fetch weather for the reminder
    try {
      const weather = await getWeatherForecast(reminderData.city, reminderData.date)
      newReminder.weather = weather
    } catch (error) {
      console.error('Failed to fetch weather:', error)
    }

    reminders.value.push(newReminder)
    return newReminder
  }

  async function updateReminder(id: number, updates: Partial<ReminderFormData>): Promise<Reminder | null> {
    const index = reminders.value.findIndex(r => r.id === id)
    if (index !== -1) {
      const reminder = reminders.value[index]
      
      // Update fields
      Object.assign(reminder, {
        ...updates,
        text: updates.text ? updates.text.substring(0, 30) : reminder.text
      })

      // Refetch weather if city or date changed
      if (updates.city || updates.date) {
        try {
          const weather = await getWeatherForecast(
            updates.city || reminder.city,
            updates.date || reminder.date
          )
          reminder.weather = weather
        } catch (error) {
          console.error('Failed to fetch weather:', error)
        }
      }

      return reminder
    }
    return null
  }

  function deleteReminder(id: number): boolean {
    const index = reminders.value.findIndex(r => r.id === id)
    if (index !== -1) {
      reminders.value.splice(index, 1)
      return true
    }
    return false
  }

  function deleteAllRemindersForDate(date: string): void {
    reminders.value = reminders.value.filter(r => r.date !== date)
  }

  function setMonth(month: number): void {
    currentMonth.value = month
  }

  function setYear(year: number): void {
    currentYear.value = year
  }

  function nextMonth(): void {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  function previousMonth(): void {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function goToToday(): void {
    currentMonth.value = dayjs().month()
    currentYear.value = dayjs().year()
  }

  return {
    // State
    reminders,
    currentMonth,
    currentYear,
    
    // Getters
    remindersByDate,
    getRemindersForDate,
    
    // Actions
    addReminder,
    updateReminder,
    deleteReminder,
    deleteAllRemindersForDate,
    setMonth,
    setYear,
    nextMonth,
    previousMonth,
    goToToday
  }
})
