import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalendarStore } from '../calendar'
import dayjs from 'dayjs'
import type { ReminderFormData } from '../../types'

// Mock the weather service
vi.mock('../../services/weatherService', () => ({
  getWeatherForecast: vi.fn(() => Promise.resolve({
    description: 'Clear',
    icon: '01d',
    temp: 25,
    humidity: 60
  }))
}))

describe('Calendar Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Add Reminder', () => {
    it('should add a new reminder with all required fields', async () => {
      const store = useCalendarStore()
      
      const reminderData: ReminderFormData = {
        text: 'Team meeting',
        date: '2025-10-15',
        time: '14:00',
        city: 'New York',
        color: '#ef4444'
      }

      const reminder = await store.addReminder(reminderData)

      expect(reminder).toBeDefined()
      expect(reminder.id).toBe(1)
      expect(reminder.text).toBe('Team meeting')
      expect(reminder.date).toBe('2025-10-15')
      expect(reminder.time).toBe('14:00')
      expect(reminder.city).toBe('New York')
      expect(reminder.color).toBe('#ef4444')
      expect(store.reminders.length).toBe(1)
    })

    it('should truncate reminder text to 30 characters', async () => {
      const store = useCalendarStore()
      
      const reminderData: ReminderFormData = {
        text: 'This is a very long reminder text that exceeds thirty characters',
        date: '2025-10-15',
        time: '14:00',
        city: 'New York',
        color: '#ef4444'
      }

      const reminder = await store.addReminder(reminderData)

      expect(reminder.text.length).toBe(30)
      expect(reminder.text).toBe('This is a very long reminder t')
    })

    it('should fetch weather data for the reminder', async () => {
      const store = useCalendarStore()
      
      const reminderData: ReminderFormData = {
        text: 'Beach day',
        date: '2025-10-15',
        time: '10:00',
        city: 'Miami',
        color: '#3b82f6'
      }

      const reminder = await store.addReminder(reminderData)

      expect(reminder.weather).toBeDefined()
      expect(reminder.weather!.description).toBe('Clear')
      expect(reminder.weather!.temp).toBe(25)
    })

    it('should assign unique IDs to multiple reminders', async () => {
      const store = useCalendarStore()
      
      const reminder1 = await store.addReminder({
        text: 'First reminder',
        date: '2025-10-15',
        time: '10:00',
        city: 'Boston',
        color: '#ef4444'
      })

      const reminder2 = await store.addReminder({
        text: 'Second reminder',
        date: '2025-10-15',
        time: '14:00',
        city: 'Boston',
        color: '#3b82f6'
      })

      expect(reminder1.id).toBe(1)
      expect(reminder2.id).toBe(2)
      expect(store.reminders.length).toBe(2)
    })
  })

  describe('Update Reminder', () => {
    it('should update an existing reminder', async () => {
      const store = useCalendarStore()
      
      const reminder = await store.addReminder({
        text: 'Original text',
        date: '2025-10-15',
        time: '10:00',
        city: 'Boston',
        color: '#ef4444'
      })

      const updated = await store.updateReminder(reminder.id, {
        text: 'Updated text',
        time: '15:00'
      })

      expect(updated!.text).toBe('Updated text')
      expect(updated!.time).toBe('15:00')
      expect(updated!.city).toBe('Boston') // Unchanged
    })

    it('should refetch weather when city changes', async () => {
      const store = useCalendarStore()
      
      const reminder = await store.addReminder({
        text: 'Meeting',
        date: '2025-10-15',
        time: '10:00',
        city: 'Boston',
        color: '#ef4444'
      })

      const updated = await store.updateReminder(reminder.id, {
        city: 'Seattle'
      })

      expect(updated!.city).toBe('Seattle')
      expect(updated!.weather).toBeDefined()
    })

    it('should return null for non-existent reminder', async () => {
      const store = useCalendarStore()
      
      const result = await store.updateReminder(999, {
        text: 'Updated'
      })

      expect(result).toBeNull()
    })
  })

  describe('Delete Reminder', () => {
    it('should delete a reminder by ID', async () => {
      const store = useCalendarStore()
      
      const reminder = await store.addReminder({
        text: 'To be deleted',
        date: '2025-10-15',
        time: '10:00',
        city: 'Boston',
        color: '#ef4444'
      })

      const result = store.deleteReminder(reminder.id)

      expect(result).toBe(true)
      expect(store.reminders.length).toBe(0)
    })

    it('should return false when deleting non-existent reminder', () => {
      const store = useCalendarStore()
      
      const result = store.deleteReminder(999)

      expect(result).toBe(false)
    })
  })

  describe('Delete All Reminders for Date', () => {
    it('should delete all reminders for a specific date', async () => {
      const store = useCalendarStore()
      
      await store.addReminder({
        text: 'Reminder 1',
        date: '2025-10-15',
        time: '10:00',
        city: 'Boston',
        color: '#ef4444'
      })

      await store.addReminder({
        text: 'Reminder 2',
        date: '2025-10-15',
        time: '14:00',
        city: 'Boston',
        color: '#3b82f6'
      })

      await store.addReminder({
        text: 'Reminder 3',
        date: '2025-10-16',
        time: '10:00',
        city: 'Boston',
        color: '#22c55e'
      })

      store.deleteAllRemindersForDate('2025-10-15')

      expect(store.reminders.length).toBe(1)
      expect(store.reminders[0].date).toBe('2025-10-16')
    })
  })

  describe('Reminders by Date', () => {
    it('should group reminders by date', async () => {
      const store = useCalendarStore()
      
      await store.addReminder({
        text: 'Morning meeting',
        date: '2025-10-15',
        time: '09:00',
        city: 'Boston',
        color: '#ef4444'
      })

      await store.addReminder({
        text: 'Lunch',
        date: '2025-10-15',
        time: '12:00',
        city: 'Boston',
        color: '#3b82f6'
      })

      await store.addReminder({
        text: 'Other day',
        date: '2025-10-16',
        time: '10:00',
        city: 'Boston',
        color: '#22c55e'
      })

      const byDate = store.remindersByDate

      expect(byDate['2025-10-15'].length).toBe(2)
      expect(byDate['2025-10-16'].length).toBe(1)
    })

    it('should sort reminders by time within each date', async () => {
      const store = useCalendarStore()
      
      await store.addReminder({
        text: 'Afternoon',
        date: '2025-10-15',
        time: '15:00',
        city: 'Boston',
        color: '#ef4444'
      })

      await store.addReminder({
        text: 'Morning',
        date: '2025-10-15',
        time: '09:00',
        city: 'Boston',
        color: '#3b82f6'
      })

      await store.addReminder({
        text: 'Noon',
        date: '2025-10-15',
        time: '12:00',
        city: 'Boston',
        color: '#22c55e'
      })

      const reminders = store.remindersByDate['2025-10-15']

      expect(reminders[0].time).toBe('09:00')
      expect(reminders[1].time).toBe('12:00')
      expect(reminders[2].time).toBe('15:00')
    })
  })

  describe('Month Navigation', () => {
    it('should navigate to next month', () => {
      const store = useCalendarStore()
      store.currentMonth = 5 // June
      store.currentYear = 2025

      store.nextMonth()

      expect(store.currentMonth).toBe(6) // July
      expect(store.currentYear).toBe(2025)
    })

    it('should navigate to next year when at December', () => {
      const store = useCalendarStore()
      store.currentMonth = 11 // December
      store.currentYear = 2025

      store.nextMonth()

      expect(store.currentMonth).toBe(0) // January
      expect(store.currentYear).toBe(2026)
    })

    it('should navigate to previous month', () => {
      const store = useCalendarStore()
      store.currentMonth = 5 // June
      store.currentYear = 2025

      store.previousMonth()

      expect(store.currentMonth).toBe(4) // May
      expect(store.currentYear).toBe(2025)
    })

    it('should navigate to previous year when at January', () => {
      const store = useCalendarStore()
      store.currentMonth = 0 // January
      store.currentYear = 2025

      store.previousMonth()

      expect(store.currentMonth).toBe(11) // December
      expect(store.currentYear).toBe(2024)
    })

    it('should go to today', () => {
      const store = useCalendarStore()
      const today = dayjs()

      store.goToToday()

      expect(store.currentMonth).toBe(today.month())
      expect(store.currentYear).toBe(today.year())
    })
  })
})
