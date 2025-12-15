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