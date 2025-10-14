export interface Reminder {
  id: number
  text: string
  date: string
  time: string
  city: string
  color: string
  weather: Weather | null
}

export interface Weather {
  description: string
  icon: string
  temp: number
  humidity: number
}

export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  dayOfWeek: number
}

export interface MonthOption {
  value: number
  label: string
}

export interface ReminderFormData {
  text: string
  date: string
  time: string
  city: string
  color: string
}

export interface RemindersByDate {
  [date: string]: Reminder[]
}
