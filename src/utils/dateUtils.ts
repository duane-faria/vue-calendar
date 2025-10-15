import dayjs from 'dayjs'
import type { CalendarDay, MonthOption } from '../types'

/**
 * Get the days to display in a calendar month view
 * Includes days from previous and next month to fill the grid
 */
export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = dayjs(`${year}-${month + 1}-01`)
  const lastDay = firstDay.endOf('month')
  const startDate = firstDay.startOf('week')
  const endDate = lastDay.endOf('week')
  
  const days: CalendarDay[] = []
  let currentDate = startDate
  
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    days.push({
      date: currentDate.format('YYYY-MM-DD'),
      day: currentDate.date(),
      isCurrentMonth: currentDate.month() === month,
      isToday: currentDate.isSame(dayjs(), 'day'),
      dayOfWeek: currentDate.day()
    })
    currentDate = currentDate.add(1, 'day')
  }
  
  return days
}

/**
 * Format date for display
 */
export function formatDate(date: string, format: string = 'MMMM D, YYYY'): string {
  return dayjs(date).format(format)
}

/**
 * Get month name
 */
export function getMonthName(month: number): string {
  return dayjs().month(month).format('MMMM')
}

/**
 * Get all months
 */
export function getMonths(): MonthOption[] {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: dayjs().month(i).format('MMMM')
  }))
}

/**
 * Get year range
 */
export function getYearRange(startYear: number, endYear: number): number[] {
  const years: number[] = []
  for (let year = startYear; year <= endYear; year++) {
    years.push(year)
  }
  return years
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: string): boolean {
  return dayjs(date).isBefore(dayjs(), 'day')
}

/**
 * Get day of week names
 */
export function getDayNames(): string[] {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}
