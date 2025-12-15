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