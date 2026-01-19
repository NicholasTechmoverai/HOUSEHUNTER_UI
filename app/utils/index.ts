export const NAVIGATION_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export const FOOTER_LINKS = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Status', href: '/status' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Community', href: '/community' },
    { name: 'Help Center', href: '/help' },
    { name: 'Support', href: '/support' },
    { name: 'Partners', href: '/partners' },
    { name: 'Tutorials', href: '/tutorials' },
  ]
}

export const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com', icon: 'i-simple-icons-github' },
  { name: 'Twitter', href: 'https://twitter.com', icon: 'i-simple-icons-twitter' },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'i-simple-icons-linkedin' },
  { name: 'Discord', href: 'https://discord.com', icon: 'i-simple-icons-discord' },
  { name: 'YouTube', href: 'https://youtube.com', icon: 'i-simple-icons-youtube' },
]

export const LEGAL_LINKS = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'Disclaimer', href: '/disclaimer' },
]




  // {
  //   lat: -1.286389,
  //   long: 36.817223,
  //   id: "1",
  //   public_id: "prop_001",
  //   image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
  //   price: {
  //     currency: "KES",
  //     value: 45000,
  //     period: "monthly",
  //     display: "KSh 45,000/month"
  //   },
  //   deposit: {
  //     currency: "KES",
  //     value: 90000,
  //     display: "KSh 90,000"
  //   },
  //   title: "Modern 2BR Apartment",
  //   bedrooms: 2,
  //   bathrooms: 2,
  //   area: {
  //     value: 85,
  //     unit: "m²",
  //     display: "85 m²"
  //   },
  //   location: "Kilimani, Nairobi",
  //   amenities: ["Parking", "Gym", "Pool", "Balcony"],
  //   description: "Spacious apartment with balcony and panoramic city views",
  //   contact: "+254 712 345 678",
  //   available: "Immediately",
  //   rating: 4.5
  // },




  // User Data with enhanced fields
const user = ref<User>({
  account: {
    currentAccount: 'user',
    availableAccounts: [
      { id: '1', name: 'Business Account', verified: true, status: 'active' },
      { id: '2', name: 'Agent Account', verified: false, status: 'pending' },
      { id: '3', name: 'Property Manager', verified: true, status: 'active' }
    ]
  },
  name: 'John Doe',
  profile_picture: 'https://github.com/benjamincanac.png',
  userName: 'johndoe',
  publicId: 'USR-7A9B2C4D',
  email: {
    email: 'john.doe@example.com',
    email_verified: true
  },
  phone_number: {
    phone_country_code: '+254',
    phone_number: '74567890',
    phone_verified: true
  },
  location: {
    country: 'Kenya',
    county: 'Nairobi County',
    state: 'Nairobi',
    city: 'Nairobi',
    address: '123 Main Street, Westlands',
    coordinates: { lat: -1.2921, long: 36.8219 }
  },
  currency: 'KES',
  locale: 'en-KE',
  bio: 'Real estate professional with 10+ years experience specializing in luxury properties and commercial real estate. Passionate about helping clients find their dream homes.',
  occupation: 'Real Estate Agent',
  company: 'Prime Properties Ltd',
  job_title: 'Senior Agent & Property Consultant',
  industry: 'Real Estate & Property Management',
  website: 'https://johndoe.properties',
  status: 'premium',
  date_of_birth: '1985-06-15',
  gender: 'Male',
  created_at: '2022-01-15T10:30:00Z',
  last_active: new Date().toISOString(),
  verification_level: 'premium'
})