import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  Wind, 
  Droplets, 
  Thermometer, 
  Eye, 
  Gauge,
  MapPin,
  Search,
  Loader2,
  Calendar,
  Clock,
  Moon,
  Sun as SunIcon
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import React from 'react'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchCity, setSearchCity] = useState('')
  const [currentLocation, setCurrentLocation] = useState({ lat: 40.7128, lon: -74.0060, name: 'New York' }) // Default to NYC
  const [isDark, setIsDark] = useState(false)

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Weather code to icon mapping
  const getWeatherIcon = (code, isDay = true) => {
    const iconProps = { size: 48, className: "text-blue-500" }
    
    switch (code) {
      case 0: return <Sun {...iconProps} className="text-yellow-500" />
      case 1:
      case 2:
      case 3: return isDay ? <Sun {...iconProps} className="text-yellow-400" /> : <Cloud {...iconProps} />
      case 45:
      case 48: return <Cloud {...iconProps} className="text-gray-400" />
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 65: return <CloudRain {...iconProps} />
      case 71:
      case 73:
      case 75: return <CloudSnow {...iconProps} />
      case 80:
      case 81:
      case 82: return <CloudRain {...iconProps} />
      case 95:
      case 96:
      case 99: return <Zap {...iconProps} className="text-purple-500" />
      default: return <Sun {...iconProps} />
    }
  }

  // Weather code to description mapping
  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail'
    }
    return descriptions[code] || 'Unknown'
  }

  // Simple in-memory cache for weather data
  const weatherCache = React.useRef({})

  // Fetch weather data with caching
  const fetchWeatherData = async (lat, lon) => {
    setLoading(true)
    setError(null)
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`
    if (weatherCache.current[cacheKey]) {
      setWeatherData(weatherCache.current[cacheKey])
      setLoading(false)
      return
    }
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      const data = await response.json()
      setWeatherData(data)
      weatherCache.current[cacheKey] = data
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ lat: latitude, lon: longitude, name: 'Current Location' })
          fetchWeatherData(latitude, longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to default location
          fetchWeatherData(currentLocation.lat, currentLocation.lon)
        }
      )
    } else {
      // Fallback to default location
      fetchWeatherData(currentLocation.lat, currentLocation.lon)
    }
  }

  // Search for city using Open-Meteo geocoding API
  const handleSearchCity = async () => {
    setError(null)
    if (!searchCity.trim()) {
      setError('Please enter a city name.')
      return
    }
    setLoading(true)
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&language=en&format=json`
      )
      if (!geoRes.ok) throw new Error('Failed to fetch city coordinates')
      const geoData = await geoRes.json()
      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found. Please try another city.')
        setLoading(false)
        return
      }
      const city = geoData.results[0]
      setCurrentLocation({ lat: city.latitude, lon: city.longitude, name: city.name })
      await fetchWeatherData(city.latitude, city.longitude)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Format hourly data for charts
  const getHourlyChartData = () => {
    if (!weatherData?.hourly) return []
    
    return weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      time: new Date(time).getHours() + ':00',
      temperature: Math.round(weatherData.hourly.temperature_2m[index]),
      precipitation: weatherData.hourly.precipitation_probability[index] || 0
    }))
  }

  // Format daily data
  const getDailyForecast = () => {
    if (!weatherData?.daily) return []
    
    return weatherData.daily.time.map((date, index) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      maxTemp: Math.round(weatherData.daily.temperature_2m_max[index]),
      minTemp: Math.round(weatherData.daily.temperature_2m_min[index]),
      weatherCode: weatherData.daily.weather_code[index],
      precipitation: weatherData.daily.precipitation_sum[index] || 0,
      windSpeed: Math.round(weatherData.daily.wind_speed_10m_max[index])
    }))
  }

  // Load initial data
  useEffect(() => {
    getCurrentLocation()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 relative">
          {/* Theme Toggle Button */}
          <div className="absolute top-0 right-0">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
            >
              {isDark ? <SunIcon size={16} /> : <Moon size={16} />}
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Weather Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Real-time weather forecasts and conditions</p>
          
          {/* Search */}
          <div className="flex max-w-md mx-auto gap-2">
            <Input
              placeholder="Search city (e.g., London, Tokyo, Paris)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchCity()}
              className="flex-1"
            />
            <Button onClick={handleSearchCity} disabled={loading}>
              <Search size={16} />
            </Button>
            <Button onClick={getCurrentLocation} disabled={loading} variant="outline">
              <MapPin size={16} />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin" size={32} />
            <span className="ml-2 text-lg">Loading weather data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Weather Data */}
        {weatherData && !loading && (
          <>
            {/* Current Weather */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} />
                  {currentLocation.name}
                  <Badge variant="secondary" className="ml-auto">
                    <Clock size={12} className="mr-1" />
                    Now
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Main Temperature */}
                  <div className="text-center">
                    {getWeatherIcon(weatherData.current.weather_code, weatherData.current.is_day)}
                    <div className="text-4xl font-bold mt-2">
                      {Math.round(weatherData.current.temperature_2m)}°C
                    </div>
                    <div className="text-lg opacity-90">
                      {getWeatherDescription(weatherData.current.weather_code)}
                    </div>
                    <div className="text-sm opacity-75">
                      Feels like {Math.round(weatherData.current.apparent_temperature)}°C
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Wind size={16} />
                      <span>Wind: {Math.round(weatherData.current.wind_speed_10m)} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets size={16} />
                      <span>Humidity: {weatherData.current.relative_humidity_2m}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge size={16} />
                      <span>Pressure: {Math.round(weatherData.current.pressure_msl)} hPa</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Cloud size={16} />
                      <span>Cloud Cover: {weatherData.current.cloud_cover}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      <span>Wind Direction: {weatherData.current.wind_direction_10m}°</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <div className="text-2xl font-semibold">
                      {weatherData.current.is_day ? '☀️ Day' : '🌙 Night'}
                    </div>
                    <div className="text-sm opacity-75 mt-2">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Temperature Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Thermometer size={20} />
                    24-Hour Temperature Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getHourlyChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280" 
                        className="dark:stroke-gray-400"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        className="dark:stroke-gray-400"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          color: 'var(--color-foreground)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Precipitation Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <CloudRain size={20} />
                    Precipitation Probability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getHourlyChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280" 
                        className="dark:stroke-gray-400"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        className="dark:stroke-gray-400"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          color: 'var(--color-foreground)'
                        }}
                      />
                      <Bar dataKey="precipitation" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* 7-Day Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Calendar size={20} />
                  7-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {getDailyForecast().map((day, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">{day.date}</div>
                      <div className="mb-2">
                        {getWeatherIcon(day.weatherCode, true)}
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-gray-900 dark:text-white">{day.maxTemp}°</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">{day.minTemp}°</div>
                        {day.precipitation > 0 && (
                          <div className="text-blue-500 dark:text-blue-400 text-xs">
                            {day.precipitation}mm
                          </div>
                        )}
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {day.windSpeed} km/h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Weather Dashboard built by <a href="https://github.com/ndeiya" className="text-blue-500" target="_blank" rel="noopener noreferrer">Abdul Rahaman Abdulai</a></p>
          <p>Built with React, Tailwind CSS, and Recharts</p>
          <p>Weather data provided by Open-Meteo API</p>
        </div>
      </div>
    </div>
  )
}

export default App

