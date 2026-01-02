// utils/form-validators.ts
import { EMAIL_REGEX, PASSWORD_REQUIREMENTS, FORM_MESSAGES } from '~/constants/auth'

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: FORM_MESSAGES.REQUIRED }
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: FORM_MESSAGES.EMAIL_INVALID }
  }
  
  return { isValid: true }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: FORM_MESSAGES.REQUIRED }
  }
  
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return { isValid: false, message: FORM_MESSAGES.PASSWORD_LENGTH }
  }
  
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: FORM_MESSAGES.PASSWORD_UPPERCASE }
  }
  
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, message: FORM_MESSAGES.PASSWORD_LOWERCASE }
  }
  
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    return { isValid: false, message: FORM_MESSAGES.PASSWORD_NUMBER }
  }
  
  return { isValid: true }
}

export const validateFullName = (fullName: string): ValidationResult => {
  if (!fullName.trim()) {
    return { isValid: false, message: FORM_MESSAGES.REQUIRED }
  }
  
  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0)
  if (nameParts.length < 2) {
    return { isValid: false, message: FORM_MESSAGES.FULL_NAME }
  }
  
  return { isValid: true }
}

export const validatePasswordsMatch = (
  password: string, 
  confirmPassword: string
): ValidationResult => {
  if (password !== confirmPassword) {
    return { isValid: false, message: FORM_MESSAGES.PASSWORDS_MATCH }
  }
  
  return { isValid: true }
}

export interface BreadcrumbItem {
  label: string
  to?: string
  disabled?: boolean
}

export const useBreadcrumbs = () => {
  const route = useRoute()
  
  return computed(() => {
    const crumbs: BreadcrumbItem[] = []
    const segments = route.path.split('/').filter(Boolean)
    
    // Always start with Home
    crumbs.push({
      label: 'Home',
      to: '/',
      disabled: false
    })
    
    // Build path hierarchy
    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      
      crumbs.push({
        label: formatSegmentLabel(segment, index, segments),
        to: isLast ? undefined : currentPath,
        disabled: isLast
      })
    })
    
    return crumbs
  })
}

function formatSegmentLabel(segment: string, index: number, allSegments: string[]): string {
  // Level 1: Main sections
  if (index === 0) {
    const sectionLabels: Record<string, string> = {
      'rentals': 'Rentals',
      'apartments': 'Apartments',
      'swaps': 'Swaps',
      'dashboard': 'Dashboard',
      'properties': 'Properties',
      'admin': 'Admin',
      'profile': 'Profile',
      'settings': 'Settings'
    }
    
    return sectionLabels[segment] || formatText(segment)
  }
  
  // Level 2: Sub-sections or IDs
  if (index === 1) {
    // If it's a numeric ID
    if (/^\d+$/.test(segment)) {
      return `Item ${segment}`
    }
    
    const slugLabels: Record<string, string> = {
      'villa': 'Villa',
      'apartment': 'Apartment',
      'house': 'House',
      'penthouse': 'Penthouse',
      'studio': 'Studio',
      'cottage': 'Cottage',
      'edit': 'Edit',
      'create': 'Create',
      'list': 'List'
    }
    
    return slugLabels[segment] || formatText(segment)
  }
  
  // Level 3+: Deep nesting
  if (index >= 2) {
    // For IDs
    if (/^\d+$/.test(segment)) {
      return `#${segment}`
    }
    
    // For common actions
    const actionLabels: Record<string, string> = {
      'edit': 'Edit',
      'view': 'View',
      'settings': 'Settings',
      'photos': 'Photos',
      'amenities': 'Amenities',
      'reviews': 'Reviews',
      'analytics': 'Analytics'
    }
    
    return actionLabels[segment] || formatText(segment)
  }
  
  return formatText(segment)
}

function formatText(text: string): string {
  // Convert kebab-case, snake_case, or camelCase to Title Case
  return text
    .replace(/[-_]/g, ' ') // Replace - and _ with spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}