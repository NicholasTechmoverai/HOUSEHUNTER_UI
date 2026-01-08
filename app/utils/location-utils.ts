// utils/location-utils.ts
import { KENYA_COUNTIES } from '~/constants/auth'

export interface IpInfo {
  country: string
  city: string
  region: string
  ip_address: string
  latitude?: number
  longitude?: number
}

export interface LocationData {
  ipInfo: IpInfo
  isKenyanUser: boolean
  suggestedCountry: string
  suggestedRegion: string
}

export const fetchUserLocation = async (): Promise<LocationData> => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    const ipInfo: IpInfo = {
      country: data.country_name || '',
      city: data.city || '',
      region: data.region || '',
      ip_address: data.ip || '',
      latitude: data.latitude,
      longitude: data.longitude
    }
    
    const isKenyanUser = ipInfo.country === 'Kenya'
    const suggestedRegion = isKenyanUser && ipInfo.region && KENYA_COUNTIES.includes(ipInfo.region) 
      ? ipInfo.region 
      : ''
    
    return {
      ipInfo,
      isKenyanUser,
      suggestedCountry: ipInfo.country || '',
      suggestedRegion
    }
  } catch {
    return {
      ipInfo: { country: '', city: '', region: '', ip_address: '' },
      isKenyanUser: false,
      suggestedCountry: '',
      suggestedRegion: ''
    }
  }
}




// utils/geocoding.ts
interface GeocodeResult {
  lat: number
  lng: number
  display_name: string
  importance: number
  boundingbox: [number, number, number, number]
}

interface GeocodeOptions {
  country?: string
  city?: string
  state?: string
}

export const geocodeLocation = async (options: GeocodeOptions): Promise<GeocodeResult | null> => {
  try {
    const { country, city, state } = options
    
    // Build query string
    let query = ''
    if (city) query += city
    if (state) query += `, ${state}`
    if (country) query += `, ${country}`
    
    if (!query.trim()) return null
    
    // Use OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`
    )
    
    if (!response.ok) throw new Error('Geocoding failed')
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name,
        importance: data[0].importance,
        boundingbox: data[0].boundingbox.map(parseFloat)
      }
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export const getCountryBounds = async (country: string): Promise<GeocodeResult | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(country)}&format=json&limit=1&featuretype=country`
    )
    
    if (!response.ok) throw new Error('Country geocoding failed')
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name,
        importance: data[0].importance,
        boundingbox: data[0].boundingbox.map(parseFloat)
      }
    }
    
    return null
  } catch (error) {
    console.error('Country geocoding error:', error)
    return null
  }
}

// Cache results to avoid hitting rate limits
const geocodeCache = new Map<string, GeocodeResult>()

export const cachedGeocode = async (options: GeocodeOptions): Promise<GeocodeResult | null> => {
  const cacheKey = JSON.stringify(options)
  
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!
  }
  
  const result = await geocodeLocation(options)
  if (result) {
    geocodeCache.set(cacheKey, result)
  }
  
  return result
}


type OpenMapPayload = {
  address?: string
  city?: string
  lat?: number
  long?: number
}


export const openOnGoogleMaps = async (val: OpenMapPayload) => {
  let query = ''

  if (typeof val.lat === 'number' && typeof val.long === 'number') {
    query = `${val.lat},${val.long}`
  } else if (val.address && val.city) {
    query = `${val.address}, ${val.city}`
  } else if (val.address) {
    query = val.address
  } else if (val.city) {
    query = val.city
  } else {
    console.warn('No valid location data provided')
    return
  }

  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

  await navigateTo(url, {
    external: true,
    open: { target: '_blank' }
  })
}
