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


export const sampleHeatMaps = [
  {
    lat: -1.286389,
    long: 36.817223,
    id: "1",
    public_id: "prop_001",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 45000,
      period: "monthly",
      display: "KSh 45,000/month"
    },
    deposit: {
      currency: "KES",
      value: 90000,
      display: "KSh 90,000"
    },
    title: "Modern 2BR Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: {
      value: 85,
      unit: "m²",
      display: "85 m²"
    },
    location: "Kilimani, Nairobi",
    amenities: ["Parking", "Gym", "Pool", "Balcony"],
    description: "Spacious apartment with balcony and panoramic city views",
    contact: "+254 712 345 678",
    available: "Immediately",
    rating: 4.5
  },
  {
    lat: -1.2921,
    long: 36.8219,
    id: "2",
    public_id: "prop_002",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 65000,
      period: "monthly",
      display: "KSh 65,000/month"
    },
    deposit: {
      currency: "KES",
      value: 130000,
      display: "KSh 130,000"
    },
    title: "Luxury 3BR Villa",
    bedrooms: 3,
    bathrooms: 3,
    area: {
      value: 150,
      unit: "m²",
      display: "150 m²"
    },
    location: "Westlands, Nairobi",
    amenities: ["Garden", "Security", "Parking", "CCTV"],
    description: "Modern villa with private garden and secure parking",
    contact: "+254 723 456 789",
    available: "1st Next Month",
    rating: 4.8
  },
  {
    lat: -1.2747,
    long: 36.8120,
    id: "3",
    public_id: "prop_003",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 35000,
      period: "monthly",
      display: "KSh 35,000/month"
    },
    deposit: {
      currency: "KES",
      value: 70000,
      display: "KSh 70,000"
    },
    title: "Cozy 1BR Studio",
    bedrooms: 1,
    bathrooms: 1,
    area: {
      value: 55,
      unit: "m²",
      display: "55 m²"
    },
    location: "Kileleshwa, Nairobi",
    amenities: ["Balcony", "Security", "Water Backup", "WiFi"],
    description: "Recently renovated studio perfect for young professionals",
    contact: "+254 734 567 890",
    available: "Immediately",
    rating: 4.2
  },
  {
    lat: -1.3048,
    long: 36.8060,
    id: "4",
    public_id: "prop_004",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 85000,
      period: "monthly",
      display: "KSh 85,000/month"
    },
    deposit: {
      currency: "KES",
      value: 170000,
      display: "KSh 170,000"
    },
    title: "Penthouse 4BR",
    bedrooms: 4,
    bathrooms: 3,
    area: {
      value: 200,
      unit: "m²",
      display: "200 m²"
    },
    location: "Upper Hill, Nairobi",
    amenities: ["Pool", "Gym", "Concierge", "Parking", "Sauna"],
    description: "Luxury penthouse with panoramic city views and premium amenities",
    contact: "+254 745 678 901",
    available: "Negotiable",
    rating: 4.9
  },
  {
    lat: -1.2700,
    long: 36.8300,
    id: "5",
    public_id: "prop_005",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 55000,
      period: "monthly",
      display: "KSh 55,000/month"
    },
    deposit: {
      currency: "KES",
      value: 110000,
      display: "KSh 110,000"
    },
    title: "Townhouse 3BR",
    bedrooms: 3,
    bathrooms: 2,
    area: {
      value: 120,
      unit: "m²",
      display: "120 m²"
    },
    location: "Lavington, Nairobi",
    amenities: ["Garden", "Parking", "Security", "Play Area"],
    description: "Family-friendly townhouse with backyard and secure compound",
    contact: "+254 756 789 012",
    available: "Immediately",
    rating: 4.6
  },
  {
    lat: -1.3150,
    long: 36.8250,
    id: "6",
    public_id: "prop_006",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 40000,
      period: "monthly",
      display: "KSh 40,000/month"
    },
    deposit: {
      currency: "KES",
      value: 80000,
      display: "KSh 80,000"
    },
    title: "2BR Garden Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: {
      value: 90,
      unit: "m²",
      display: "90 m²"
    },
    location: "Karen, Nairobi",
    amenities: ["Garden", "Parking", "Pet Friendly", "Balcony"],
    description: "Quiet garden apartment in serene Karen neighborhood",
    contact: "+254 767 890 123",
    available: "Immediately",
    rating: 4.4
  },
  {
    lat: -1.2800,
    long: 36.8100,
    id: "7",
    public_id: "prop_007",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 95000,
      period: "monthly",
      display: "KSh 95,000/month"
    },
    deposit: {
      currency: "KES",
      value: 190000,
      display: "KSh 190,000"
    },
    title: "Executive 3BR Duplex",
    bedrooms: 3,
    bathrooms: 3,
    area: {
      value: 180,
      unit: "m²",
      display: "180 m²"
    },
    location: "Runda, Nairobi",
    amenities: ["Swimming Pool", "Gym", "Jacuzzi", "Gated Community"],
    description: "Executive duplex in exclusive Runda estate",
    contact: "+254 778 901 234",
    available: "1st December",
    rating: 4.9
  },
  {
    lat: -1.2900,
    long: 36.8000,
    id: "8",
    public_id: "prop_008",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 30000,
      period: "monthly",
      display: "KSh 30,000/month"
    },
    deposit: {
      currency: "KES",
      value: 60000,
      display: "KSh 60,000"
    },
    title: "1BR Serviced Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: {
      value: 50,
      unit: "m²",
      display: "50 m²"
    },
    location: "CBD, Nairobi",
    amenities: ["24/7 Security", "Cleaning Service", "WiFi", "Parking"],
    description: "Fully serviced apartment in central business district",
    contact: "+254 789 012 345",
    available: "Immediately",
    rating: 4.1
  },
  {
    lat: -1.3100,
    long: 36.8400,
    id: "9",
    public_id: "prop_009",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 75000,
      period: "monthly",
      display: "KSh 75,000/month"
    },
    deposit: {
      currency: "KES",
      value: 150000,
      display: "KSh 150,000"
    },
    title: "4BR Family House",
    bedrooms: 4,
    bathrooms: 3,
    area: {
      value: 220,
      unit: "m²",
      display: "220 m²"
    },
    location: "Kitisuru, Nairobi",
    amenities: ["Garden", "Parking x2", "Maid's Quarter", "Security"],
    description: "Spacious family house with large compound and garden",
    contact: "+254 790 123 456",
    available: "Immediately",
    rating: 4.7
  },
  {
    lat: -1.3000,
    long: 36.8150,
    id: "10",
    public_id: "prop_010",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 50000,
      period: "monthly",
      display: "KSh 50,000/month"
    },
    deposit: {
      currency: "KES",
      value: 100000,
      display: "KSh 100,000"
    },
    title: "Modern 2BR Maisonette",
    bedrooms: 2,
    bathrooms: 2,
    area: {
      value: 100,
      unit: "m²",
      display: "100 m²"
    },
    location: "South B, Nairobi",
    amenities: ["Parking", "Balcony", "Security", "Water Backup"],
    description: "Modern maisonette with open plan living area",
    contact: "+254 701 234 567",
    available: "15th November",
    rating: 4.3
  },
  {
    lat: -1.2750,
    long: 36.8200,
    id: "11",
    public_id: "prop_011",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 110000,
      period: "monthly",
      display: "KSh 110,000/month"
    },
    deposit: {
      currency: "KES",
      value: 220000,
      display: "KSh 220,000"
    },
    title: "Luxury 5BR Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: {
      value: 350,
      unit: "m²",
      display: "350 m²"
    },
    location: "Muthaiga, Nairobi",
    amenities: ["Pool", "Tennis Court", "Gym", "Security", "Generator"],
    description: "Premium villa in exclusive Muthaiga neighborhood",
    contact: "+254 712 345 678",
    available: "Negotiable",
    rating: 5.0
  },
  {
    lat: -1.2950,
    long: 36.8050,
    id: "12",
    public_id: "prop_012",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 42000,
      period: "monthly",
      display: "KSh 42,000/month"
    },
    deposit: {
      currency: "KES",
      value: 84000,
      display: "KSh 84,000"
    },
    title: "2BR Riverside Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: {
      value: 88,
      unit: "m²",
      display: "88 m²"
    },
    location: "Riverside, Nairobi",
    amenities: ["River View", "Balcony", "Parking", "Gym", "Pool"],
    description: "Beautiful apartment with serene river views",
    contact: "+254 723 456 789",
    available: "Immediately",
    rating: 4.5
  },
  {
    lat: -1.2850,
    long: 36.7900,
    id: "13",
    public_id: "prop_013",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 38000,
      period: "monthly",
      display: "KSh 38,000/month"
    },
    deposit: {
      currency: "KES",
      value: 76000,
      display: "KSh 76,000"
    },
    title: "2BR Affordable Flat",
    bedrooms: 2,
    bathrooms: 1,
    area: {
      value: 75,
      unit: "m²",
      display: "75 m²"
    },
    location: "Donholm, Nairobi",
    amenities: ["Parking", "Security", "Water Backup"],
    description: "Affordable and well-maintained flat in Donholm",
    contact: "+254 734 567 890",
    available: "Immediately",
    rating: 4.0
  },
  {
    lat: -1.3050,
    long: 36.8350,
    id: "14",
    public_id: "prop_014",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 60000,
      period: "monthly",
      display: "KSh 60,000/month"
    },
    deposit: {
      currency: "KES",
      value: 120000,
      display: "KSh 120,000"
    },
    title: "3BR Garden Cottage",
    bedrooms: 3,
    bathrooms: 2,
    area: {
      value: 130,
      unit: "m²",
      display: "130 m²"
    },
    location: "Langata, Nairobi",
    amenities: ["Garden", "Parking", "Security", "Pet Friendly"],
    description: "Charming cottage with beautiful garden in Langata",
    contact: "+254 745 678 901",
    available: "1st December",
    rating: 4.6
  },
  {
    lat: -1.3200,
    long: 36.8050,
    id: "15",
    public_id: "prop_015",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 28000,
      period: "monthly",
      display: "KSh 28,000/month"
    },
    deposit: {
      currency: "KES",
      value: 56000,
      display: "KSh 56,000"
    },
    title: "1BR Student Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: {
      value: 45,
      unit: "m²",
      display: "45 m²"
    },
    location: "Nairobi West",
    amenities: ["WiFi", "Study Desk", "Security", "Laundry"],
    description: "Perfect for students with study-friendly environment",
    contact: "+254 756 789 012",
    available: "Immediately",
    rating: 4.2
  },
  {
    lat: -1.2650,
    long: 36.8250,
    id: "16",
    public_id: "prop_016",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 70000,
      period: "monthly",
      display: "KSh 70,000/month"
    },
    deposit: {
      currency: "KES",
      value: 140000,
      display: "KSh 140,000"
    },
    title: "3BR Modern Townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: {
      value: 140,
      unit: "m²",
      display: "140 m²"
    },
    location: "Ngong Road, Nairobi",
    amenities: ["Parking", "Garden", "Security", "Balcony"],
    description: "Modern townhouse close to major highways and amenities",
    contact: "+254 767 890 123",
    available: "Immediately",
    rating: 4.5
  },
  {
    lat: -1.2900,
    long: 36.8300,
    id: "17",
    public_id: "prop_017",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 48000,
      period: "monthly",
      display: "KSh 48,000/month"
    },
    deposit: {
      currency: "KES",
      value: 96000,
      display: "KSh 96,000"
    },
    title: "2BR Serviced Residence",
    bedrooms: 2,
    bathrooms: 2,
    area: {
      value: 92,
      unit: "m²",
      display: "92 m²"
    },
    location: "Yaya Centre, Nairobi",
    amenities: ["Cleaning", "Laundry", "WiFi", "Parking", "Gym"],
    description: "Fully serviced residence near shopping mall and amenities",
    contact: "+254 778 901 234",
    available: "Immediately",
    rating: 4.4
  },
  {
    lat: -1.2750,
    long: 36.8150,
    id: "18",
    public_id: "prop_018",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop",
    price: {
      currency: "KES",
      value: 90000,
      period: "monthly",
      display: "KSh 90,000/month"
    },
    deposit: {
      currency: "KES",
      value: 180000,
      display: "KSh 180,000"
    },
    title: "Penthouse with Terrace",
    bedrooms: 3,
    bathrooms: 3,
    area: {
      value: 180,
      unit: "m²",
      display: "180 m²"
    },
    location: "Upperhill, Nairobi",
    amenities: ["Terrace", "Pool", "Gym", "Concierge", "Parking x2"],
    description: "Stunning penthouse with large private terrace",
    contact: "+254 789 012 345",
    available: "Negotiable",
    rating: 4.8
  }
];