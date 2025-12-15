export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
} as const

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const API_ENDPOINTS = {
  IP_GEOLOCATION: 'https://ipapi.co/json/',
  COUNTRIES: 'https://restcountries.com/v3.1/all?fields=name,cca2',
  KENYA_COUNTIES: '/api/kenya/counties', // You'll need to create this endpoint
} as const

export const FORM_MESSAGES = {
  REQUIRED: 'Please fill in all required fields',
  FULL_NAME: 'Please enter your full name (first and last name)',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_LENGTH: 'Password must be at least 8 characters long',
  PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_NUMBER: 'Password must contain at least one number',
  PASSWORDS_MATCH: 'Passwords do not match',
  TERMS_AGREEMENT: 'You must agree to the Terms & Conditions',
} as const

// Kenyan counties data
export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
] as const