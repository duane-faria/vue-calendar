# Vue 3 Calendar Application

A feature-rich calendar application built with Vue 3 Composition API and TypeScript, featuring reminder management with weather integration.

## Features

### Mandatory Features
- ✅ Add reminders (max 30 chars) with day, time, and city
- ✅ Display reminders in correct time order
- ✅ Color selection for reminders
- ✅ Edit reminders (text, city, day, time, color)
- ✅ Weather forecast integration using OpenWeatherMap API
- ✅ Unit tests for reminder functionality

### Bonus Features
- ✅ Multi-month navigation
- ✅ Overflow handling for multiple reminders
- ✅ Delete single or all reminders for a specific day

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **Day.js** for date handling
- **Axios** for API calls
- **Vitest** for unit testing
- **Vite** for build tooling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
```
VITE_WEATHER_API_KEY=your_api_key_here
```

Get a free API key from: https://openweathermap.org/api

3. Run the development server:
```bash
npm run dev
```

4. Type check (optional):
```bash
npm run type-check
```

5. Run tests:
```bash
npm test
```

6. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Calendar.vue          # Main calendar component
│   ├── CalendarDay.vue       # Individual day cell
│   ├── ReminderModal.vue     # Add/Edit reminder modal
│   └── ReminderItem.vue      # Reminder display component
├── stores/
│   └── calendar.js           # Pinia store for state management
├── services/
│   └── weatherService.js     # Weather API integration
├── utils/
│   └── dateUtils.js          # Date utility functions
├── App.vue                   # Root component
└── main.js                   # Application entry point
```

## Usage

- **Navigate months**: Use the previous/next buttons or month/year selectors
- **Add reminder**: Click on any day to open the reminder modal
- **Edit reminder**: Click on an existing reminder to edit it
- **Delete reminder**: Click the delete button on a reminder or delete all reminders for a day
- **View weather**: Weather forecast is automatically fetched for each reminder based on the city

## API Key Note

This application uses the OpenWeatherMap API for weather forecasts. A free API key is required and should be added to the `.env` file as shown above.
