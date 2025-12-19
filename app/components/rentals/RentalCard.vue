<script setup lang="ts">
import type { PropType } from 'vue'

interface Location {
  loc: string;
  address: string;
  city: string;
  country: string;
  onmap: { lat: number; long: number };
  onmapLink: string;
  nearfields: Array<{
    name: string;
    link: string;
    distance_to: string;
    type: string;
  }>;
}

interface MediaFile {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  thumbnail?: string;
}

interface Rating {
  overall: number;
  cleanliness: number;
  location: number;
  value: number;
  communication: number;
}

interface Review {
  id: string;
  profile_pic: string;
  username: string;
  link: string;
  rating: number;
  message: string;
  date: string;
  verified: boolean;
}

interface Amenity {
  icon: string;
  name: string;
  info: string;
  link: string;
  available: boolean;
}

interface Pricing {
  amount: number;
  currency: string;
  period: 'day' | 'week' | 'month';
  deposit: number;
  utilities_included: boolean;
  discount?: {
    percentage: number;
    valid_until: string;
  };
}

interface Contact {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  verified: boolean;
  response_time: string;
  agency?: string;
}

interface Rental {
  id: string;
  title: string;
  subtitle: string;
  status: 'available' | 'rented' | 'pending' | 'maintenance';
  featured: boolean;
  location: Location;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  year_built: number;
  cover_file: MediaFile;
  files: MediaFile[];
  ratings: Rating;
  total_ratings: number;
  likes: number;
  saved_by: number;
  views_today: number;
  reviews: {
    no: number;
    link: string;
    revs: Review[];
  };
  description: {
    info: string;
    highlights: string[];
    keywords: string[];
  };
  amenities: Amenity[];
  pricing: Pricing;
  availability: {
    status: 'immediate' | 'specific_date';
    available_from: string;
    minimum_stay: number;
    maximum_stay: number;
  };
  rules: {
    general: string;
    link: string;
    policies: string[];
  };
  contact: Contact;
  listed_date: string;
  updated_date: string;
  verification_status: string;
  featured_until: string;
}
const getPlaceTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    education: 'bg-blue-900/50 text-blue-400',
    commercial: 'bg-purple-900/50 text-purple-400',
    landmark: 'bg-amber-900/50 text-amber-400',
    shopping: 'bg-green-900/50 text-green-400'
  }
  return colors[type] || 'bg-gray-900/50 text-gray-400'
}
const props = defineProps({
  rental: {
    type: Object as PropType<Rental>,
    required: true
  }
})

// Format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount)
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get status color
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    available: 'green',
    rented: 'red',
    pending: 'yellow',
    maintenance: 'gray'
  }
  return colors[status] || 'gray'
}

// Get status text
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    available: 'Available Now',
    rented: 'Rented',
    pending: 'Pending',
    maintenance: 'Under Maintenance'
  }
  return texts[status] || status
}

const rental = {
  // Basic Information
  id: "RNT-2024-001",
  title: "Spacious 3-Bedroom House with Garden",
  subtitle: "Modern house with water and electricity included",
  status: "available", // available, rented, pending, maintenance
  featured: true,

  // Location Details
  location: {
    loc: "Nakuru Pipeline Estate",
    address: "Pipeline Road, House No. 42",
    city: "Nakuru",
    country: "Kenya",
    onmap: { lat: -0.303099, long: 36.080026 },
    onmapLink: "https://maps.google.com/maps?q=Nakuru+Pipeline",
    nearfields: [
      {
        name: "Nairobi Road Primary School",
        link: "#",
        distance_to: "1.2km",
        type: "education"
      },
      {
        name: "Kenya Pipeline Company Nakuru Depot",
        link: "#",
        distance_to: "800m",
        type: "commercial"
      },
      {
        name: "Lanet Military Barracks",
        link: "#",
        distance_to: "3.5km",
        type: "landmark"
      },
      {
        name: "Nakuru Town CBD",
        link: "#",
        distance_to: "4.7km",
        type: "commercial"
      },
      {
        name: "Pipeline Shopping Centre",
        link: "#",
        distance_to: "500m",
        type: "shopping"
      }
    ]
  },

  // Property Details
  property_type: "house",
  bedrooms: 3,
  bathrooms: 2,
  square_feet: 1800,
  year_built: 2018,

  // Media Files
  cover_file: {
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    alt: "Modern house exterior"
  },
  files: [
    {
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      alt: "Living room interior"
    },
    {
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      alt: "Modern kitchen"
    },
    {
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      alt: "Master bedroom"
    },
    {
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      alt: "Garden view"
    },
    {
      type: "video" as const,
      url: "https://example.com/video-tour.mp4",
      thumbnail: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80"
    }
  ],

  // Ratings & Reviews
  ratings: {
    overall: 4.2,
    cleanliness: 4.5,
    location: 4.0,
    value: 4.3,
    communication: 4.7
  },
  total_ratings: 42,
  likes: 109,
  saved_by: 56,
  views_today: 24,

  reviews: {
    no: 34,
    link: "#reviews",
    revs: [
      {
        id: "rev-001",
        profile_pic: "https://randomuser.me/api/portraits/men/32.jpg",
        username: "John Kamau",
        link: "#user-john",
        rating: 5,
        message: "Great house! The location is perfect and the landlord is very responsive. Would definitely recommend!",
        date: "2024-01-15",
        verified: true
      },
      {
        id: "rev-002",
        profile_pic: "https://randomuser.me/api/portraits/women/44.jpg",
        username: "Sarah Mwangi",
        link: "#user-sarah",
        rating: 4,
        message: "Spacious and well-maintained. Close to amenities and schools. Minor water pressure issues but otherwise excellent.",
        date: "2024-01-10",
        verified: true
      },
      {
        id: "rev-003",
        profile_pic: "https://randomuser.me/api/portraits/men/67.jpg",
        username: "David Ochieng",
        link: "#user-david",
        rating: 4.5,
        message: "Peaceful neighborhood. Garden is well kept. Good security.",
        date: "2024-01-05",
        verified: false
      }
    ]
  },

  // Description
  description: {
    info: "This beautiful 3-bedroom house is located in the serene Pipeline Estate of Nakuru. Fully furnished with modern amenities including a spacious living room, fully equipped kitchen, and a beautiful garden perfect for family gatherings. Water and electricity bills are included in the rent. The property is well-secured with 24/7 security and ample parking space.",
    highlights: [
      "Fully furnished with modern appliances",
      "Water and electricity included",
      "24/7 Security with CCTV",
      "Garden and outdoor seating area",
      "Ample parking space"
    ],
    keywords: ["family-friendly", "secure", "modern", "garden", "near-schools"]
  },

  // Amenities
  amenities: [
    {
      icon: "wifi",
      name: "High-Speed WiFi",
      info: "Fiber optic connection",
      link: "#amenity-wifi",
      available: true
    },
    {
      icon: "parking",
      name: "Parking Space",
      info: "2 covered parking spots",
      link: "#amenity-parking",
      available: true
    },
    {
      icon: "security",
      name: "24/7 Security",
      info: "Guards & CCTV",
      link: "#amenity-security",
      available: true
    },
    {
      icon: "water",
      name: "Water Supply",
      info: "Included in rent",
      link: "#amenity-water",
      available: true
    },
    {
      icon: "electricity",
      name: "Electricity",
      info: "Prepaid meter",
      link: "#amenity-electricity",
      available: true
    },
    {
      icon: "garden",
      name: "Garden",
      info: "Well-maintained",
      link: "#amenity-garden",
      available: true
    },
    {
      icon: "laundry",
      name: "Laundry Area",
      info: "With drying lines",
      link: "#amenity-laundry",
      available: true
    },
    {
      icon: "ac",
      name: "Air Conditioning",
      info: "In master bedroom",
      link: "#amenity-ac",
      available: false
    }
  ],

  // Pricing Information
  pricing: {
    amount: 35000,
    currency: "KES",
    period: "month",
    deposit: 70000,
    utilities_included: true,
    discount: {
      percentage: 10,
      valid_until: "2024-02-28"
    }
  },

  // Availability
  availability: {
    status: "immediate", // immediate, specific_date
    available_from: "2024-02-01",
    minimum_stay: 6, // months
    maximum_stay: 24 // months
  },

  // Rules & Policies
  rules: {
    general: "No smoking inside the house. Pets allowed with prior approval. Quiet hours from 10 PM to 7 AM.",
    link: "#full-rules",
    policies: [
      "No parties or events",
      "Maximum 6 occupants",
      "Renter's insurance required",
      "3 months notice for termination"
    ]
  },

  // Contact Information
  contact: {
    name: "Michael Wangari",
    phone: "+254712345678",
    email: "michael.wangari@example.com",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    verified: true,
    response_time: "Usually responds within 2 hours",
    agency: "Prime Properties Ltd"
  },

  // Metadata
  listed_date: "2024-01-20",
  updated_date: "2024-01-25",
  verification_status: "verified",
  featured_until: "2024-02-20"
};
</script>
<template>
  <div class="relative w-full max-w-lg mx-auto cursor-pointer group transition-all duration-300">
    <!-- Main card container -->
    <div class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <!-- Background image with gradient overlay -->
      <div class="relative h-80 overflow-hidden">
        <img 
          :src="rental.cover_file.url" 
          :alt="rental.cover_file.alt || rental.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        
        <!-- Top badges row -->
        <div class="absolute top-4 left-4 right-4 flex justify-between">
          <!-- Status badge -->
          <div 
            :class="`bg-${getStatusColor(rental.status)}-500 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg`"
          >
            {{ getStatusText(rental.status) }}
          </div>
          
          <!-- Featured badge -->
          <div v-if="rental.featured" 
               class="bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg">
            ✨ FEATURED
          </div>
        </div>
        
        <!-- Bottom info row -->
        <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <!-- Price info -->
          <div class="flex flex-col">
            <div class="text-3xl font-bold text-white drop-shadow-lg">
              {{ formatCurrency(rental.pricing.amount, rental.pricing.currency) }}
              <span class="text-base font-normal">/{{ rental.pricing.period }}</span>
            </div>
            <div v-if="rental.pricing.discount" class="text-sm text-amber-300 font-semibold">
              {{ rental.pricing.discount.percentage }}% OFF
            </div>
          </div>
          
          <!-- Deposit & utilities -->
          <div class="flex flex-col items-end gap-1">
            <div class="bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div class="text-xs text-gray-300">Deposit</div>
              <div class="text-sm font-bold text-white">
                {{ formatCurrency(rental.pricing.deposit, rental.pricing.currency) }}
              </div>
            </div>
            <div v-if="rental.pricing.utilities_included" class="text-xs text-green-300 bg-green-900/30 px-2 py-1 rounded">
              Utilities included
            </div>
          </div>
        </div>
      </div>

      <!-- Content overlay - Hobbit poster style -->
      <div class="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white p-6 transform-gpu shadow-2xl">
        <div class="space-y-4">
          <!-- Title section -->
          <div>
            <h2 class="text-2xl font-bold text-white leading-tight">
              {{ rental.title }}
            </h2>
            <h3 class="text-base font-medium text-amber-300 mt-1">
              {{ rental.subtitle }}
            </h3>
          </div>

          <!-- Property details row -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
            <!-- Location -->
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-map-pin-20-solid" class="w-5 h-5 text-amber-400" />
              <div>
                <div class="font-medium text-gray-300">{{ rental.location.loc }}</div>
                <div class="text-xs text-gray-400">{{ rental.location.city }}, {{ rental.location.country }}</div>
              </div>
            </div>
            
            <!-- Property specs -->
            <div class="flex items-center gap-4">
              <div class="flex flex-col items-center">
                <UIcon name="i-heroicons-home-20-solid" class="w-5 h-5 text-blue-400" />
                <span class="font-bold text-lg">{{ rental.bedrooms }}</span>
                <span class="text-xs text-gray-400">Beds</span>
              </div>
              <div class="flex flex-col items-center">
                <UIcon name="i-heroicons-bath-20-solid" class="w-5 h-5 text-blue-400" />
                <span class="font-bold text-lg">{{ rental.bathrooms }}</span>
                <span class="text-xs text-gray-400">Baths</span>
              </div>
              <div class="flex flex-col items-center">
                <UIcon name="i-heroicons-square-3-stack-3d-20-solid" class="w-5 h-5 text-blue-400" />
                <span class="font-bold text-lg">{{ rental.square_feet.toLocaleString() }}</span>
                <span class="text-xs text-gray-400">Sq Ft</span>
              </div>
            </div>
          </div>

          <!-- Ratings & engagement -->
          <div class="bg-gray-800/40 p-3 rounded-xl">
            <div class="flex items-center justify-between">
              <!-- Overall rating -->
              <div class="flex items-center gap-3">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <div class="text-2xl font-bold">{{ rental.ratings.overall }}</div>
                    <div class="flex">
                      <UIcon v-for="i in 5" :key="i" 
                        name="i-heroicons-star-20-solid" 
                        :class="`w-5 h-5 ${i <= Math.floor(rental.ratings.overall) ? 'text-yellow-400' : 'text-gray-600'}`" 
                      />
                    </div>
                  </div>
                  <div class="text-xs text-gray-400">{{ rental.total_ratings }} reviews</div>
                </div>
              </div>
              
              <!-- Engagement stats -->
              <div class="flex items-center gap-4">
                <div class="flex flex-col items-center">
                  <UIcon name="i-heroicons-heart-20-solid" class="w-5 h-5 text-red-400" />
                  <span class="text-sm font-bold">{{ rental.likes }}</span>
                  <span class="text-xs text-gray-400">Likes</span>
                </div>
                <div class="flex flex-col items-center">
                  <UIcon name="i-heroicons-eye-20-solid" class="w-5 h-5 text-gray-400" />
                  <span class="text-sm font-bold">{{ rental.views_today }}</span>
                  <span class="text-xs text-gray-400">Today</span>
                </div>
                <div class="flex flex-col items-center">
                  <UIcon name="i-heroicons-bookmark-20-solid" class="w-5 h-5 text-amber-400" />
                  <span class="text-sm font-bold">{{ rental.saved_by }}</span>
                  <span class="text-xs text-gray-400">Saved</span>
                </div>
              </div>
            </div>
            
            <!-- Detailed ratings -->
            <div class="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Cleanliness</span>
                <span class="font-bold text-gray-300">{{ rental.ratings.cleanliness }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Location</span>
                <span class="font-bold text-gray-300">{{ rental.ratings.location }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Value</span>
                <span class="font-bold text-gray-300">{{ rental.ratings.value }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Communication</span>
                <span class="font-bold text-gray-300">{{ rental.ratings.communication }}</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-gray-800/30 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-300 mb-2">Description</h4>
            <p class="text-sm text-gray-300 leading-relaxed line-clamp-3">
              {{ rental.description.info }}
            </p>
            <button class="text-amber-400 text-xs font-medium mt-2 hover:text-amber-300 transition-colors">
              Read more...
            </button>
          </div>

          <!-- Highlights -->
          <div class="bg-gray-800/30 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-300 mb-3">Highlights</h4>
            <div class="flex flex-wrap gap-2">
              <div v-for="(highlight, index) in rental.description.highlights" :key="index"
                   class="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                <UIcon name="i-heroicons-check-circle-20-solid" class="w-4 h-4 text-green-400" />
                {{ highlight }}
              </div>
            </div>
            
            <!-- Keywords -->
            <div class="mt-3">
              <h4 class="text-sm font-semibold text-gray-300 mb-2">Tags</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(keyword, index) in rental.description.keywords" 
                  :key="index"
                  class="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 rounded-full border border-gray-600 hover:border-amber-500/50 transition-colors duration-200"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>

          <!-- Image carousel section -->
          <div class="bg-gray-800/30 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-300 mb-3">Gallery ({{ rental.files.length }})</h4>
            <UCarousel 
              v-slot="{ item }" 
              auto-height 
              arrows 
              dots 
              :items="rental.files" 
              :autoplay="{ delay: 3500 }" 
              :ui="{
                container: 'transition-[height] rounded-lg overflow-hidden',
                controls: 'absolute -top-6 inset-x-8',
                dots: '-top-5',
                dot: 'w-8 h-1.5 bg-gray-600 hover:bg-amber-500 transition-colors duration-200',
                arrow: 'text-white bg-gray-900/90 hover:bg-amber-600 backdrop-blur-sm'
              }" 
              class="w-full"
            >
              <div class="relative">
                <img 
                  v-if="item.type === 'image'"
                  :src="item.url" 
                  :alt="item.alt" 
                  class="w-full h-56 object-cover rounded-lg shadow-lg"
                />
                <div v-else class="relative w-full h-56 rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    :src="item.thumbnail" 
                    :alt="item.alt || 'Video thumbnail'"
                    class="w-full h-full object-cover opacity-70"
                  />
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="bg-black/50 rounded-full p-3">
                      <UIcon name="i-heroicons-play-circle-20-solid" class="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Video Tour
                  </div>
                </div>
              </div>
            </UCarousel>
          </div>

          <!-- Amenities -->
          <div class="bg-gray-800/30 p-4 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-gray-300">Amenities</h4>
              <span class="text-xs text-gray-400">{{ rental.amenities.filter(a => a.available).length }} available</span>
            </div>
            <div class="grid grid-cols-4 gap-3">
              <div 
                v-for="(amenity, index) in rental.amenities.slice(0, 8)" 
                :key="index"
                :class="`flex flex-col items-center justify-center p-3 rounded-xl ${amenity.available ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-900/50 opacity-50'} transition-colors duration-200`"
              >
                <UIcon 
                  :name="`i-heroicons-${amenity.icon}-20-solid`" 
                  :class="`w-6 h-6 mb-2 ${amenity.available ? 'text-amber-400' : 'text-gray-500'}`" 
                />
                <span class="text-xs text-gray-300 text-center font-medium line-clamp-2">{{ amenity.name }}</span>
                <span v-if="amenity.info" class="text-xs text-gray-500 text-center mt-1 line-clamp-1">{{ amenity.info }}</span>
              </div>
            </div>
            <div v-if="rental.amenities.length > 8" class="text-center mt-3">
              <button class="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                Show all {{ rental.amenities.length }} amenities
              </button>
            </div>
          </div>

          <!-- Nearby places -->
          <div v-if="rental.location.nearfields.length > 0" class="bg-gray-800/30 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-300 mb-3">Nearby Places</h4>
            <div class="space-y-2">
              <div v-for="(place, index) in rental.location.nearfields.slice(0, 3)" :key="index" 
                   class="flex items-center justify-between bg-gray-800/50 px-3 py-2.5 rounded-lg hover:bg-gray-800/70 transition-colors duration-200">
                <div class="flex items-center gap-3">
                  <div :class="`p-2 rounded-lg ${getPlaceTypeColor(place.type)}`">
                    <UIcon name="i-heroicons-map-pin-20-solid" class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-300">{{ place.name }}</div>
                    <div class="text-xs text-gray-500 capitalize">{{ place.type }}</div>
                  </div>
                </div>
                <div class="text-sm font-bold text-amber-400">{{ place.distance_to }}</div>
              </div>
            </div>
            <div v-if="rental.location.nearfields.length > 3" class="text-center mt-3">
              <button class="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                +{{ rental.location.nearfields.length - 3 }} more nearby places
              </button>
            </div>
          </div>

          <!-- Availability & contact -->
          <div class="bg-gray-800/30 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Availability -->
              <div>
                <h4 class="text-sm font-semibold text-gray-300 mb-2">Availability</h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-400">Available from:</span>
                    <span class="text-sm font-medium text-gray-300">{{ formatDate(rental.availability.available_from) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-400">Minimum stay:</span>
                    <span class="text-sm font-medium text-gray-300">{{ rental.availability.minimum_stay }} months</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-400">Maximum stay:</span>
                    <span class="text-sm font-medium text-gray-300">{{ rental.availability.maximum_stay }} months</span>
                  </div>
                </div>
              </div>
              
              <!-- Contact info -->
              <div>
                <h4 class="text-sm font-semibold text-gray-300 mb-2">Contact</h4>
                <div class="flex items-center gap-3">
                  <UAvatar 
                    :src="rental.contact.avatar" 
                    :alt="rental.contact.name" 
                    size="lg"
                    class="border-2 border-amber-500/30"
                  />
                  <div>
                    <div class="flex items-center gap-2">
                      <div class="font-bold text-gray-300">{{ rental.contact.name }}</div>
                      <UIcon v-if="rental.contact.verified" 
                        name="i-heroicons-check-badge-20-solid" 
                        class="w-4 h-4 text-green-400" 
                      />
                    </div>
                    <div v-if="rental.contact.agency" class="text-sm text-amber-300">{{ rental.contact.agency }}</div>
                    <div class="text-xs text-gray-400 mt-1">{{ rental.contact.response_time }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action buttons -->
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
              <div class="flex items-center gap-2">
                <UButton 
                  icon="i-heroicons-heart-20-solid"
                  color="gray"
                  variant="ghost"
                  size="sm"
                  :ui="{ rounded: 'rounded-full' }"
                  class="text-gray-400 hover:text-red-400"
                  :label="rental.saved_by.toString()"
                />
                <UButton 
                  icon="i-heroicons-share-20-solid"
                  color="gray"
                  variant="ghost"
                  size="sm"
                  :ui="{ rounded: 'rounded-full' }"
                  class="text-gray-400 hover:text-blue-400"
                  label="Share"
                />
              </div>
              
              <div class="flex items-center gap-2">
                <UButton 
                  icon="i-heroicons-calendar-20-solid"
                  color="amber"
                  variant="outline"
                  size="sm"
                  :ui="{ rounded: 'rounded-lg' }"
                  class="border-amber-500 text-amber-400 hover:bg-amber-900/20"
                >
                  Schedule Visit
                </UButton>
                <UButton 
                  icon="i-heroicons-envelope-20-solid"
                  color="amber"
                  variant="solid"
                  size="sm"
                  :ui="{ rounded: 'rounded-lg' }"
                  class="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium shadow-lg"
                >
                  Contact Now
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Verification badge -->
      <div v-if="rental.verification_status === 'verified'" 
           class="absolute top-2 right-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg z-10">
        <UIcon name="i-heroicons-check-badge-20-solid" class="w-4 h-4" />
        Verified Property
      </div>

      <!-- Decorative corner accents -->
      <div class="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg"></div>
      <div class="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg"></div>
      <div class="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
      <div class="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500/30 rounded-br-lg"></div>
    </div>
  </div>
</template>
<!-- 
<script setup lang="ts">
// Add this helper function for place type colors
const getPlaceTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    education: 'bg-blue-900/50 text-blue-400',
    commercial: 'bg-purple-900/50 text-purple-400',
    landmark: 'bg-amber-900/50 text-amber-400',
    shopping: 'bg-green-900/50 text-green-400'
  }
  return colors[type] || 'bg-gray-900/50 text-gray-400'
}
</script> -->

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transform-gpu {
  transform: translate3d(0, 0, 0);
}

/* Status color classes */
.bg-available { background-color: #10b981; }
.bg-rented { background-color: #ef4444; }
.bg-pending { background-color: #f59e0b; }
.bg-maintenance { background-color: #6b7280; }

/* Smooth transitions */
.transition-all {
  transition-property: all;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(251, 191, 36, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(251, 191, 36, 0.5);
}
</style>