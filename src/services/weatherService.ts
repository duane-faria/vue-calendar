import axios from 'axios'
import type { Weather } from '../types'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

interface WeatherResponse {
  coord: {
    lat: number
    lon: number
  }
  data: unknown
}

interface ForecastItem {
  dt: number
  weather: Array<{
    main: string
    icon: string
  }>
  main: {
    temp: number
    humidity: number
  }
}

interface ForecastResponse {
  list: ForecastItem[]
}

/**
 * Get weather forecast for a specific city and date
 */
export async function getWeatherForecast(city: string, date: string): Promise<Weather | null> {
  if (!API_KEY) {
    console.warn('Weather API key not configured')
    return null
  }

  try {
    // First, get coordinates for the city
    const geoResponse = await axios.get<WeatherResponse>(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY
      }
    })

    const { coord } = geoResponse.data
    
    // Get 5-day forecast
    const forecastResponse = await axios.get<ForecastResponse>(`${BASE_URL}/forecast`, {
      params: {
        lat: coord.lat,
        lon: coord.lon,
        appid: API_KEY,
        units: 'metric'
      }
    })

    // Find forecast closest to the target date
    const targetDate = new Date(date).setHours(12, 0, 0, 0)
    const forecasts = forecastResponse.data.list
    
    let closestForecast = forecasts[0]
    let minDiff = Math.abs(new Date(forecasts[0].dt * 1000).getTime() - targetDate)
    
    for (const forecast of forecasts) {
      const forecastDate = new Date(forecast.dt * 1000)
      const diff = Math.abs(forecastDate.getTime() - targetDate)
      
      if (diff < minDiff) {
        minDiff = diff
        closestForecast = forecast
      }
    }

    return {
      description: closestForecast.weather[0].main,
      icon: closestForecast.weather[0].icon,
      temp: Math.round(closestForecast.main.temp),
      humidity: closestForecast.main.humidity
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

/**
 * Get weather icon URL
 */
export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}
