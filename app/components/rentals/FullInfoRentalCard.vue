<script setup lang="ts">
// Import interfaces
interface BasePrice {
  id: string;
  rent: number;
  currency: string;
  rent_frequency: string;
  discount: number;
  deposit_amount: number;
  deposit_months: number;
  is_deposit_refundable: boolean;
  minimum_lease_months: number;
  sort_order: number;
  created_at: string;
}

interface ExtraFee {
  id: string;
  name: string;
  amount: number | null;
  is_included: boolean;
  sort_order: number;
  currency: string;
}

interface Pricing {
  base_price: BasePrice;
  extra_fees: ExtraFee[];
}

interface Amenity {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_featured: boolean;
  icon: string;
}

interface GalleryImage {
  url: string;
  caption: string | null;
  file_type: string;
  mime_type: string;
  is_primary: boolean;
}

interface Publisher {
  public_id: string;
  display_name: string;
  profile_picture: string;
}

interface PropertyData {
  id: string;
  public_id: string;
  title: string;
  slug: string;
  status: string;
  theme_color: string;
  category: string;
  category_id: number;
  description: string;
  profile_picture: string;
  bedrooms: number;
  bathrooms: number;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  address: string;
  price: number | null;
  is_available: boolean;
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
  pricing: Pricing;
  amenities: Amenity[];
  gallery: GalleryImage[];
  rules: any[];
  publisher: Publisher;
  managers: any;
}

const props = defineProps<{
  rental: PropertyData
}>();

const screen = useScreenSize()

const heatMapInfo = ref({
  id: props.rental?.id,
  lat: props.rental?.latitude,
  long: props.rental?.longitude,
  image: props.rental?.profile_picture,
})

// Secondary data (mock data that would come from separate API calls)
const secondaryData = ref({
  reviews: {
    count: 24,
    averageRating: 4.7,
    breakdown: {
      5: 18,
      4: 4,
      3: 1,
      2: 1,
      1: 0
    },
    recent: [
      {
        id: '1',
        author: 'John Doe',
        rating: 5,
        comment: 'Great apartment, well maintained and great location!',
        date: '2024-01-15',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      {
        id: '2',
        author: 'Jane Smith',
        rating: 4,
        comment: 'Good value for money, responsive landlord.',
        date: '2024-01-10',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      }
    ]
  },
  neighborhoodInfo: {
    safetyScore: 8.2,
    amenitiesNearby: ['Supermarket', 'Park', 'School', 'Hospital', 'Restaurants', 'Gym', 'Pharmacy', 'Bank'],
    transitScore: 7.5,
    walkScore: 8.0,
    noiseLevel: 'Low'
  },
  similarProperties: {
    count: 5,
    averagePrice: 10500,
    properties: [
      { id: '1', title: 'Modern Studio', price: 8500, beds: 1, distance: '0.5km' },
      { id: '2', title: 'Luxury Apartment', price: 12000, beds: 2, distance: '1.2km' },
      { id: '3', title: 'Cozy Flat', price: 7500, beds: 1, distance: '0.8km' }
    ]
  }
});

// Reactive state
const isExpanded = ref(false);
const isModalOpen = ref(false);
const showFullGallery = ref(false);
const activeTab = ref('overview');
const isSticky = ref(false);
const scrollPosition = ref(0);
const isFavorite = ref(false);
const isMobile = ref(false);
const isHeaderVisible = ref(true);
const lastScrollTop = ref(0);

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function onClickPrev() {
  activeIndex.value--
}
function onClickNext() {
  activeIndex.value++
}
function onSelect(index: number) {
  activeIndex.value = index
}

function select(index: number) {
  activeIndex.value = index
  carousel.value?.emblaApi?.scrollTo(index)
}

// Initialize mobile detection
onMounted(() => {
  isMobile.value = window.innerWidth < 768;

  // Sticky header logic with IntersectionObserver
  const header = document.querySelector('#property-header');
  if (header) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isHeaderVisible.value = entry.isIntersecting;
          // Only make sticky when header is not visible AND we've scrolled down enough
          isSticky.value = !entry.isIntersecting && scrollPosition.value > 200;
        });
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px' // Start observing 80px before header leaves viewport
      }
    );

    observer.observe(header);
  }

  // Track scroll position with debouncing for performance
  let scrollTimeout: NodeJS.Timeout;
  const handleScroll = () => {
    scrollPosition.value = window.scrollY;
    lastScrollTop.value = window.scrollY;

    // Clear existing timeout
    if (scrollTimeout) clearTimeout(scrollTimeout);

    // Debounce the scroll event
    scrollTimeout = setTimeout(() => {
      // Additional logic for smooth sticky behavior
      updateStickyState();
    }, 50);
  };

  // Handle resize events
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
  };

  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });

  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    if (scrollTimeout) clearTimeout(scrollTimeout);
  });
});

// Update sticky state based on scroll direction
const updateStickyState = () => {
  const currentScroll = window.scrollY;

  // Show sticky header when scrolling up and past threshold
  if (currentScroll > 200 && currentScroll < lastScrollTop.value) {
    isSticky.value = true;
  }
  // Hide sticky header when at top
  else if (currentScroll <= 100) {
    isSticky.value = false;
  }

  lastScrollTop.value = currentScroll <= 0 ? 0 : currentScroll;
};

// Computed properties
const totalMonthlyCost = computed(() => {
  if (!props.rental?.pricing?.base_price?.rent) return null;
  let total = props.rental.pricing.base_price.rent;
  props.rental.pricing.extra_fees?.forEach(fee => {
    if (!fee.is_included && fee.amount) total += fee.amount;
  });
  return total;
});

const depositInfo = computed(() => {
  const base = props.rental?.pricing?.base_price;
  if (!base) return null;
  return {
    amount: base.deposit_amount,
    months: base.deposit_months,
    isRefundable: base.is_deposit_refundable,
    total: base.rent * (base.deposit_months || 1) + (base.deposit_amount || 0)
  };
});

const includedUtilities = computed(() => {
  return props.rental?.pricing?.extra_fees?.filter(fee => fee.is_included) || [];
});

const excludedUtilities = computed(() => {
  return props.rental?.pricing?.extra_fees?.filter(fee => !fee.is_included) || [];
});

const discountSavings = computed(() => {
  const base = props.rental?.pricing?.base_price;
  if (!base || base.discount <= 0) return null;
  return (base.rent * base.discount) / 100;
});

const displayCategory = computed(() => {
  if (!props.rental?.category) return '';
  return props.rental.category
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

const allImages = computed(() => {
  const images = [];

  // Add profile picture
  if (props.rental.profile_picture) {
    images.push({
      url: props.rental.profile_picture,
      isPrimary: true,
      caption: "Main property image",
      index: 0
    });
  }

  // Add gallery images
  props.rental.gallery?.forEach((img, index) => {
    images.push({
      url: img.url,
      isPrimary: img.is_primary,
      caption: img.caption || `${props.rental.title} - Image ${index + 1}`,
      index: index + 1
    });
  });

  return images;
});

const ratingDisplay = computed(() => {
  const rating = secondaryData.value.reviews.averageRating;
  return {
    stars: '★★★★★'.slice(0, Math.floor(rating)) + '☆☆☆☆☆'.slice(Math.floor(rating)),
    fullStars: Math.floor(rating),
    hasHalfStar: rating % 1 >= 0.5,
    percentage: (rating / 5) * 100
  };
});

const availabilityDisplay = computed(() => {
  return props.rental?.is_available
    ? { label: 'Available Now', color: 'green', icon: 'i-heroicons-check-circle' }
    : { label: 'Currently Unavailable', color: 'red', icon: 'i-heroicons-x-circle' };
});

const similarProperties = computed(() => {
  return secondaryData.value.similarProperties.properties;
});

// Helper functions
const formatCurrency = (value: number | null, currency: string = 'KES') => {
  if (value === null || value === undefined) return 'Not specified';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDistance = (km: string) => {
  const num = parseFloat(km);
  if (num < 1) return `${Math.round(num * 1000)}m`;
  return `${num.toFixed(1)}km`;
};

// Actions
const openModal = (index: number) => {
  isModalOpen.value = true;
  select(index)
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!isModalOpen.value) return;
  switch (event.key) {
    case 'ArrowLeft': onClickNext(); break;
    case 'ArrowRight': onClickPrev(); break;
    case 'Escape': closeModal(); break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  const toast = useToast();
  toast.add({
    title: isFavorite.value ? 'Added to favorites' : 'Removed from favorites',
    description: isFavorite.value ? 'Property saved to your favorites' : 'Property removed from favorites',
    icon: isFavorite.value ? 'i-heroicons-heart' : 'i-heroicons-heart-slash',
    color: isFavorite.value ? 'pink' : 'gray',
    timeout: 2000
  });
};

const shareProperty = async () => {
  const shareData = {
    title: props.rental.title,
    text: `Check out ${props.rental.title} - ${formatCurrency(props.rental.pricing.base_price.rent)}/month in ${props.rental.city}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      useToast().add({
        title: 'Link copied',
        description: 'Property link copied to clipboard',
        icon: 'i-heroicons-clipboard-document-check',
        color: 'green',
        timeout: 2000
      });
    }
  } catch (err) {
    console.log('Error sharing:', err);
  }
};

const contactOwner = () => {
  const toast = useToast();
  toast.add({
    title: 'Contact Owner',
    description: 'Opening contact form...',
    icon: 'i-heroicons-chat-bubble-left-right',
    color: 'blue',
    timeout: 2000
  });
};

const scheduleViewing = () => {
  if (!props.rental.is_available) return;

  const toast = useToast();
  toast.add({
    title: 'Schedule Viewing',
    description: 'Opening calendar to select a date...',
    icon: 'i-heroicons-calendar-days',
    color: 'primary',
    timeout: 2000
  });
};

// Tab configuration
const tabs = [
  { label: 'Overview', value: 'overview', icon: 'i-heroicons-home' },
  { label: 'Gallery', value: 'gallery', icon: 'i-heroicons-photo', badge: allImages.value.length },
  { label: 'Pricing', value: 'pricing', icon: 'i-heroicons-currency-dollar' },
  { label: 'Amenities', value: 'amenities', icon: 'i-heroicons-sparkles', badge: props.rental.amenities.length },
  { label: 'Location', value: 'location', icon: 'i-heroicons-map-pin' },
  { label: 'Reviews', value: 'reviews', icon: 'i-heroicons-chat-bubble-left-right', badge: secondaryData.value.reviews.count }
];
</script>

<template>
  <div class="min-h-screen p-0  pb-24 md:pb-32">
    <UContainer class="max-w-7xl mx-auto p-0 m-0">
      <!-- Main Content Header -->
      <div id="property-header" class="pt-8 pb-6">
        <!-- Breadcrumb & Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-2 text-sm">
            <NuxtLink to="/"
              class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              Home
            </NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
            <NuxtLink to="/rentals"
              class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              Rentals
            </NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-900 dark:text-white font-medium truncate">
              {{ rental.title }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-flag" :ui="{ rounded: 'rounded-full' }">
              Report
            </UButton>
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-share" :ui="{ rounded: 'rounded-full' }"
              @click="shareProperty">
              Share
            </UButton>
            <UButton :color="isFavorite ? 'pink' : 'gray'" variant="ghost" size="sm"
              :icon="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" :ui="{ rounded: 'rounded-full' }"
              @click="toggleFavorite">
              {{ isFavorite ? 'Saved' : 'Save' }}
            </UButton>
          </div>
        </div>

        <!-- Title and Badges -->
        <div class="mb-6">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <!-- Status Badges -->
            <UBadge :style="{ backgroundColor: rental.theme_color, color: 'white' }"
              class="px-3 py-1.5 border-none shadow-sm font-semibold">
              {{ displayCategory }}
            </UBadge>

            <UBadge :color="availabilityDisplay.color as any" variant="subtle" class="flex items-center gap-1.5">
              <UIcon :name="availabilityDisplay.icon" class="w-4 h-4" />
              {{ availabilityDisplay.label }}
            </UBadge>

            <UBadge v-if="rental.is_verified" color="blue" variant="subtle" class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-check-badge" class="w-4 h-4" />
              Verified
            </UBadge>

            <UBadge color="amber" variant="subtle" class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-star" class="w-4 h-4" />
              {{ secondaryData.reviews.averageRating.toFixed(1) }}
              <span class="text-gray-500 text-xs">({{ secondaryData.reviews.count }})</span>
            </UBadge>
          </div>

          <!-- Main Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
            {{ rental.title }}
          </h1>

          <!-- Location -->
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
            <span>{{ rental.address }}, {{ rental.city }}, {{ rental.state }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-sm">Listed {{ formatDate(rental.created_at) }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-sm font-mono text-gray-500">{{ rental.public_id }}</span>
          </div>
        </div>
      </div>

      <!-- Sticky Navigation Tabs -->
      <div :class="[
        'sticky z-40 transition-all duration-300 backdrop-blur-lg',
        isSticky
          ? 'top-15 shadow-lg'
          : 'top-0 md:top-6 bg-transparent'
      ]">
        <div class="">
          <div :class="['py-1', isSticky ? '' : '']">
            <!-- Tabs -->
            <div class="relative">
              <UTabs v-model="activeTab" :items="tabs" class="flex-1" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <!-- Left Column (2/3 width) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Image Gallery -->
          <section v-if="['overview', 'gallery'].includes(activeTab)"
            class=" rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Property Gallery</h2>
                <div class="flex items-center gap-2">
                  <UBadge color="gray" variant="subtle">
                    {{ allImages.length }} photos
                  </UBadge>
                  <UButton v-if="allImages.length > 5" color="gray" variant="ghost" size="sm"
                    @click="showFullGallery = true">
                    View all
                  </UButton>
                </div>
              </div>

              <!-- Image Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Thumbnails -->
                <div v-for="(img, index) in allImages.slice(0, 5)" :key="index"
                  class="relative rounded-lg overflow-hidden cursor-pointer group" @click="openModal(index + 1)">
                  <img :src="img.url" :alt="img.caption"
                    class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div
                    class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <UIcon name="i-heroicons-magnifying-glass-plus" class="w-6 h-6 text-white" />
                  </div>
                </div>

                <!-- View All Button -->
                <div v-if="allImages.length > 5"
                  class="relative rounded-lg overflow-hidden cursor-pointer group bg-gradient-to-br from-primary-500 to-primary-600"
                  @click="showFullGallery = true">
                  <div class="h-40 flex flex-col items-center justify-center text-white p-4">
                    <UIcon name="i-heroicons-photo" class="w-10 h-10 mb-2 opacity-90" />
                    <div class="text-2xl font-bold">+{{ allImages.length - 5 }}</div>
                    <div class="text-sm opacity-90">View all photos</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Pricing Details -->
          <section v-if="['overview', 'pricing'].includes(activeTab)"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pricing & Costs</h2>
                <div class="flex items-center gap-2">
                  <UBadge v-if="discountSavings" color="green" variant="subtle">
                    {{ rental.pricing.base_price.discount }}% OFF
                  </UBadge>
                  <UBadge color="primary" variant="subtle">
                    {{ rental.pricing.base_price.rent_frequency }}
                  </UBadge>
                </div>
              </div>

              <!-- Main Price Card -->
              <div
                class="bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/10 dark:to-gray-900 rounded-xl p-6 mb-8 border border-primary-200 dark:border-primary-800">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div class="flex items-baseline gap-3 mb-2">
                      <h3 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                        {{ formatCurrency(rental.pricing.base_price.rent, rental.pricing.base_price.currency) }}
                      </h3>
                      <span class="text-lg text-gray-600 dark:text-gray-400">/month</span>
                    </div>
                    <div v-if="discountSavings" class="flex items-center gap-2">
                      <span class="text-lg font-bold text-green-600 dark:text-green-400">
                        Save {{ formatCurrency(discountSavings, rental.pricing.base_price.currency) }}
                      </span>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">
                        with {{ rental.pricing.base_price.discount }}% discount
                      </span>
                    </div>
                  </div>

                  <!-- Quick Actions -->
                  <div class="flex flex-col gap-3">
                    <UButton color="primary" size="lg" :disabled="!rental.is_available"
                      class="font-bold shadow-lg shadow-primary-500/20" icon="i-heroicons-calendar-days"
                      @click="scheduleViewing">
                      {{ rental.is_available ? 'Book Viewing' : 'Not Available' }}
                    </UButton>
                    <UButton variant="outline" color="gray" size="lg" :disabled="!rental.is_available"
                      icon="i-heroicons-chat-bubble-left-right" @click="contactOwner">
                      Message Owner
                    </UButton>
                  </div>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="space-y-8">
                <div>
                  <h4 class="font-bold text-gray-800 dark:text-gray-200 text-lg mb-4">Base Price Details</h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Rent</p>
                      <p class="font-bold text-gray-900 dark:text-white">
                        {{ formatCurrency(rental.pricing.base_price.rent, rental.pricing.base_price.currency) }}
                      </p>
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Security Deposit</p>
                      <p class="font-bold text-gray-900 dark:text-white">
                        {{ formatCurrency(rental.pricing.base_price.deposit_amount, rental.pricing.base_price.currency)
                        }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ rental.pricing.base_price.is_deposit_refundable ? 'Refundable' : 'Non-refundable' }}
                      </p>
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Minimum Lease</p>
                      <p class="font-bold text-gray-900 dark:text-white">
                        {{ rental.pricing.base_price.minimum_lease_months }} months
                      </p>
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Frequency</p>
                      <p class="font-bold text-gray-900 dark:text-white capitalize">
                        {{ rental.pricing.base_price.rent_frequency }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Utilities -->
                <div>
                  <h4 class="font-bold text-gray-800 dark:text-gray-200 text-lg mb-4">Utilities & Bills</h4>

                  <!-- Included -->
                  <div v-if="includedUtilities.length > 0" class="mb-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                      Included in rent
                    </p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div v-for="utility in includedUtilities" :key="utility.id"
                        class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div class="flex items-center gap-2 mb-2">
                          <UIcon name="i-heroicons-check" class="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span class="font-medium text-gray-800 dark:text-gray-200">{{ utility.name }}</span>
                        </div>
                        <p v-if="utility.amount" class="text-sm text-green-600 dark:text-green-400">
                          {{ formatCurrency(utility.amount, utility.currency) }}
                        </p>
                        <p v-else class="text-sm text-green-600 dark:text-green-400">Included</p>
                      </div>
                    </div>
                  </div>

                  <!-- Excluded -->
                  <div v-if="excludedUtilities.length > 0">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 text-amber-500" />
                      Paid separately
                    </p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div v-for="utility in excludedUtilities" :key="utility.id"
                        class="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <div class="flex items-center gap-2 mb-2">
                          <UIcon name="i-heroicons-exclamation-triangle"
                            class="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span class="font-medium text-gray-800 dark:text-gray-200">{{ utility.name }}</span>
                        </div>
                        <p v-if="utility.amount" class="text-sm text-amber-600 dark:text-amber-400">
                          {{ formatCurrency(utility.amount, utility.currency) }}
                        </p>
                        <p v-else class="text-sm text-amber-600 dark:text-amber-400">To be discussed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Total Summary -->
                <div
                  class="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/20 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="font-bold text-gray-900 dark:text-white">Monthly Cost Summary</h4>
                    <UBadge color="primary" variant="subtle">Detailed Estimate</UBadge>
                  </div>

                  <div class="space-y-3">
                    <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-gray-600 dark:text-gray-400">Base Rent</span>
                      <span class="font-semibold">
                        {{ formatCurrency(rental.pricing.base_price.rent, rental.pricing.base_price.currency) }}
                      </span>
                    </div>

                    <div v-if="excludedUtilities.some(u => u.amount)"
                      class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-gray-600 dark:text-gray-400">Additional Utilities</span>
                      <span class="font-semibold">
                        {{formatCurrency(
                          excludedUtilities.reduce((sum, util) => sum + (util.amount || 0), 0),
                          rental.pricing.base_price.currency
                        )}}
                      </span>
                    </div>

                    <div v-if="discountSavings"
                      class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-green-600 dark:text-green-400">Discount</span>
                      <span class="font-semibold text-green-600 dark:text-green-400">
                        -{{ formatCurrency(discountSavings, rental.pricing.base_price.currency) }}
                      </span>
                    </div>

                    <div class="flex justify-between py-3 border-t border-gray-300 dark:border-gray-600">
                      <span class="text-lg font-bold text-gray-900 dark:text-white">Estimated Total Monthly</span>
                      <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {{ formatCurrency(totalMonthlyCost, rental.pricing.base_price.currency) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Amenities -->
          <section v-if="['overview', 'amenities'].includes(activeTab)"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Amenities & Features</h2>
                <UBadge color="gray" variant="subtle">
                  {{ rental.amenities.length }} amenities
                </UBadge>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="amenity in rental.amenities" :key="amenity.id"
                  class="flex flex-col items-center p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group">
                  <div
                    class="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 mb-3">
                    <UIcon :name="amenity.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span class="font-medium text-gray-800 dark:text-gray-200 text-center">{{ amenity.name }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Description -->
          <section v-if="activeTab === 'overview'"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Property Description</h2>
                <UBadge color="gray" variant="subtle">
                  {{ rental.description.length.toLocaleString() }} characters
                </UBadge>
              </div>

              <div class="text-gray-700 dark:text-gray-300 leading-relaxed transition-all relative"
                :class="{ 'max-h-96 overflow-hidden': !isExpanded }">
                <p class="whitespace-pre-line">{{ rental.description }}</p>
                <div v-if="!isExpanded && rental.description.length > 1000"
                  class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent">
                </div>
              </div>

              <UButton v-if="rental.description.length > 1000" color="primary" variant="ghost" :padded="false"
                class="mt-4 font-semibold" @click="isExpanded = !isExpanded">
                {{ isExpanded ? 'Show less' : 'Read more' }}
                <UIcon :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                  class="w-4 h-4 ml-1" />
              </UButton>
            </div>
          </section>

          <!-- Reviews -->
          <section v-if="activeTab === 'reviews'"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h2>
                <div class="flex items-center gap-2">
                  <div class="text-center">
                    <div class="text-3xl font-bold">{{ secondaryData.reviews.averageRating.toFixed(1) }}</div>
                    <div class="flex items-center justify-center">
                      <span class="text-amber-500">{{ ratingDisplay.stars }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Review Summary -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Overall Rating -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 class="font-bold text-gray-900 dark:text-white mb-4">Overall Rating</h3>
                  <div class="flex items-center gap-4">
                    <div class="text-5xl font-bold">{{ secondaryData.reviews.averageRating.toFixed(1) }}</div>
                    <div class="flex-1">
                      <div class="flex mb-1">
                        <span class="text-amber-500 text-xl">{{ ratingDisplay.stars }}</span>
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        Based on {{ secondaryData.reviews.count }} reviews
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Rating Breakdown -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 class="font-bold text-gray-900 dark:text-white mb-4">Rating Breakdown</h3>
                  <div class="space-y-3">
                    <div v-for="(count, stars) in secondaryData.reviews.breakdown" :key="stars"
                      class="flex items-center gap-3">
                      <div class="flex items-center gap-1 w-16">
                        <span class="text-gray-600 dark:text-gray-400">{{ stars }}</span>
                        <UIcon name="i-heroicons-star" class="w-4 h-4 text-amber-500" />
                      </div>
                      <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
                          :style="{ width: `${(count / secondaryData.reviews.count) * 100}%` }"></div>
                      </div>
                      <div class="w-10 text-right text-sm text-gray-600 dark:text-gray-400">
                        {{ count }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Reviews -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Reviews</h3>
                <div class="space-y-4">
                  <div v-for="review in secondaryData.reviews.recent" :key="review.id"
                    class="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <UAvatar :src="review.avatar" :alt="review.author" size="md" />
                        <div>
                          <h4 class="font-bold text-gray-900 dark:text-white">{{ review.author }}</h4>
                          <div class="flex items-center gap-1">
                            <span class="text-amber-500">{{ '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
                            }}</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(review.date) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
                  </div>
                </div>
              </div>

              <!-- Write Review -->
              <div class="mt-8 text-center">
                <UButton color="primary" icon="i-heroicons-pencil" size="lg">
                  Write a Review
                </UButton>
              </div>
            </div>
          </section>

          <!-- Location -->
          <section v-if="activeTab === 'location'"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Location & Neighborhood</h2>
                <UBadge color="primary" variant="subtle">
                  {{ rental.city }}, {{ rental.state }}
                </UBadge>
              </div>

              <!-- Map Preview -->
              <div
                class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden mb-6 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <DeMap :heatMaps="[heatMapInfo]" />
                </div>
                <!-- Coordinates -->
                <div class="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm">
                  <p class="text-white text-sm font-mono">
                    {{ rental.latitude.toFixed(6) }}, {{ rental.longitude.toFixed(6) }}
                  </p>
                </div>
              </div>

              <!-- Location Details -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Neighborhood Scores -->
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Neighborhood Scores</h3>
                  <div class="space-y-4">
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-900 dark:text-white">Safety</span>
                        <span class="text-2xl font-bold text-green-600 dark:text-green-400">
                          {{ secondaryData.neighborhoodInfo.safetyScore }}/10
                        </span>
                      </div>
                      <UProgress :value="secondaryData.neighborhoodInfo.safetyScore * 10" color="green" />
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-900 dark:text-white">Transit</span>
                        <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {{ secondaryData.neighborhoodInfo.transitScore }}/10
                        </span>
                      </div>
                      <UProgress :value="secondaryData.neighborhoodInfo.transitScore * 10" color="blue" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Nearby Amenities</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <div v-for="(amenity, index) in secondaryData.neighborhoodInfo.amenitiesNearby.slice(0, 6)"
                      :key="index"
                      class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ amenity }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 mt-6">
                <NuxtLink :to="`/maps?lat=${rental?.latitude}&long=${rental?.longitude}`"
                  :target="isMobileSize() ? undefined : '_blank'">
                  <UButton color="primary" icon="i-heroicons-map" class="flex-1">
                    Open Full Map
                  </UButton>
                </NuxtLink>



                <UButton variant="outline" color="gray" icon="i-heroicons-map-pin"
                  @click="openOnGoogleMaps({ lat: rental?.latitude, long: rental?.longitude })">
                  Open in Google Maps
                </UButton>
              </div>
            </div>
          </section>
        </div>

        <aside class="lg:col-span-1 space-y-1">
          <div class="sticky top-[120px] space-y-4 gap-3">

            <UPageCard class="p-0 m-0 flex flex-col mb-2" orientation="vertical" :highlight="false" spotlight
              spotlight-color="primary">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-home-modern" class="size-5 text-primary" />
                  <span class="text-lg font-medium text-gray-900 dark:text-white truncate">{{ rental.slug.slice(0, 40)
                  }}</span>
                </div>
              </template>

              <div class="space-y-2">
                <div
                  class="p-3 rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-900/5 border border-primary-100 dark:border-primary-800">
                  <p class="text-2xl font-black text-primary-600 dark:text-primary-400 leading-none">
                    {{ formatCurrency(rental.pricing.base_price.rent) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    /{{ rental.pricing.base_price.rent_frequency }}
                  </p>
                  <div class="flex items-center gap-1 mt-2 pt-2 border-t border-primary-100 dark:border-primary-800">
                    <UIcon name="i-heroicons-shield-check" class="size-3.5 text-blue-500" />
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {{ formatCurrency(rental.pricing.base_price.deposit_amount) }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">deposit</span>
                  </div>
                </div>

                <!-- Included Utilities (Horizontal Scroll) -->
                <div v-if="includedUtilities.length > 0" class="space-y-1">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-heroicons-check-circle" class="size-3.5 text-green-500" />
                      <span class="text-xs font-medium text-green-700 dark:text-green-300">Included in rent</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ includedUtilities.length }}</span>
                  </div>
                  <div class="overflow-x-auto scrollbar-hide -mx-1 px-1">
                    <div class="flex gap-1.5 pb-1">
                      <div v-for="utility in includedUtilities" :key="utility.id"
                        class="flex items-center gap-1 px-2 py-1.5 rounded-md bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 whitespace-nowrap flex-shrink-0">
                        <UIcon name="i-heroicons-check"
                          class="size-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span class="text-xs text-gray-700 dark:text-gray-300">{{ utility.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Property Details -->
                <div class="space-y-0.5">
                  <div
                    class="flex justify-between items-center py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded">
                    <span class="text-xs text-gray-600 dark:text-gray-400">Type</span>
                    <span class="text-md font-medium text-gray-900 dark:text-white truncate ml-2">{{ displayCategory
                    }}</span>
                  </div>

                  <div
                    class="flex justify-between items-center py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded">
                    <span class="text-xs text-gray-600 dark:text-gray-400">Min Lease</span>
                    <span class="text-md font-medium text-gray-900 dark:text-white">{{
                      rental.pricing.base_price.minimum_lease_months
                    }} {{ rental.pricing.rent_frequency }}</span>
                  </div>

                  <div
                    class="flex justify-between items-center py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded">
                    <span class="text-xs text-gray-600 dark:text-gray-400">Available</span>
                    <span class="text-xs font-medium"
                      :class="availabilityDisplay.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ rental.is_available ? 'Now' : 'No' }}
                    </span>
                  </div>
                </div>

                <!-- Quick Action
                <div class="pt-1">
                  <UButton color="primary" variant="solid" size="xs" class="w-full justify-center py-1.5"
                    :disabled="!rental.is_available" @click="scheduleViewing">
                    <UIcon name="i-heroicons-calendar-days" class="size-3.5 mr-1.5" />
                    <span class="text-xs">{{ rental.is_available ? 'Book Viewing' : 'Unavailable' }}</span>
                  </UButton>
                </div> -->
              </div>
            </UPageCard>

            <!-- Owner Card -->
            <UPageCard orientation="vertical" :highlight=false spotlight
              class="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">Property Owner</h3>
                  <UBadge v-if="rental.is_verified" color="blue" variant="subtle" size="sm">
                    Verified
                  </UBadge>
                </div>
              </template>

              <div class="space-y-4">
                <!-- Owner Info -->
                <div class="flex items-center gap-4">
                  <UAvatar :src="rental.publisher.profile_picture" :alt="rental.publisher.display_name" size="lg"
                    class="ring-2 ring-primary-100 dark:ring-primary-900 flex-shrink-0" />
                  <div class="min-w-0">
                    <h4 class="font-bold text-gray-900 dark:text-white truncate">
                      {{ rental.publisher.display_name }}
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                      ID: {{ rental.publisher.public_id }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <UIcon name="i-heroicons-star" class="w-4 h-4 text-amber-500" />
                      <span class="text-sm font-semibold">{{ secondaryData.reviews.averageRating.toFixed(1) }}</span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">({{ secondaryData.reviews.count }})</span>
                    </div>
                  </div>
                </div>

                <!-- Owner Stats -->
                <div class="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div class="text-center">
                    <p class="text-lg font-bold text-primary-600 dark:text-primary-400">95%</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Response Rate</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-bold text-primary-600 dark:text-primary-400">2h</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Avg Response</p>
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-bold text-primary-600 dark:text-primary-400">{{
                      secondaryData.similarProperties.count }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Properties</p>
                  </div>
                </div>

                <!-- Contact Buttons -->
                <div class="grid grid-cols-2 gap-2">
                  <UButton variant="outline" color="gray" icon="i-heroicons-phone">
                    Call
                  </UButton>
                  <UButton variant="solid" color="primary" icon="i-heroicons-chat-bubble-left-right">
                    Message
                  </UButton>
                </div>
              </div>
            </UPageCard>

            <!-- Similar Properties -->
            <UPageCard orientation="vertical" :highlight=false spotlight
              class="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
              <template #header>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Similar Properties</h3>
              </template>

              <div class="space-y-4">
                <div v-for="property in similarProperties" :key="property.id"
                  class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <div
                      class="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <UIcon name="i-heroicons-home" class="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 dark:text-white truncate">{{ property.title }}</h4>
                    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{{ property.beds }} bed</span>
                      <span>•</span>
                      <span>{{ formatCurrency(property.price) }}/month</span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ formatDistance(property.distance) }} away
                    </div>
                  </div>
                </div>
                <UButton block variant="ghost" color="primary" size="sm">
                  View all {{ secondaryData.similarProperties.count }} properties
                </UButton>
              </div>
            </UPageCard>
          </div>
        </aside>
      </div>
    </UContainer>

    <!-- Bottom Floating Action Panel -->
    <div :class="[
      'sticky! bottom-0! left-0 right-0 z-100 transition-all duration-300 transform',
      scrollPosition > 100 ? 'translate-y-0 w-full' : 'translate-y-full'
    ]">
      <div class="backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 ">

        <UContainer class="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2">
          <div class="py-4">
            <div class="flex items-center justify-between gap-4">
              <!-- Property Info -->
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <!-- Image -->
                <div
                  class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 border-primary-200 dark:border-primary-800">
                  <img :src="allImages[0]?.url" :alt="rental.title" class="w-full h-full object-cover" />
                </div>

                <!-- Details -->
                <div class="min-w-0 flex-1">
                  <h3 class="font-bold text-gray-900 dark:text-white truncate text-sm md:text-base">
                    {{ rental.title }}
                  </h3>
                  <div class="flex items-center gap-3 mt-1 flex-wrap">
                    <!-- Rating -->
                    <div class="flex items-center gap-1">
                      <UIcon name="i-heroicons-star" class="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                      <span class="font-bold text-gray-900 dark:text-white text-xs md:text-sm">
                        {{ secondaryData.reviews.averageRating.toFixed(1) }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        ({{ secondaryData.reviews.count }})
                      </span>
                    </div>

                    <!-- Location -->
                    <div class="flex items-center gap-1">
                      <UIcon name="i-heroicons-map-pin" class="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                      <span
                        class="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px] md:max-w-[200px]">
                        {{ rental.city }}
                      </span>
                    </div>

                    <!-- Deposit -->
                    <div class="hidden md:flex items-center gap-1">
                      <UIcon name="i-heroicons-shield-check" class="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                      <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        Deposit: {{ formatCurrency(rental.pricing.base_price.deposit_amount,
                          rental.pricing.base_price.currency) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Price & Actions -->
              <div class="flex items-center gap-4">
                <!-- Price -->
                <div class="text-right hidden md:block">
                  <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {{ formatCurrency(rental.pricing.base_price.rent, rental.pricing.base_price.currency) }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">/month</div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2">
                  <!-- Share -->
                  <UTooltip text="Share property">
                    <UButton color="gray" variant="ghost" size="lg"
                      :ui="{ rounded: 'rounded-full', padding: { lg: 'p-2' } }" @click="shareProperty">
                      <UIcon name="i-heroicons-share" class="w-5 h-5" />
                    </UButton>
                  </UTooltip>

                  <!-- Favorite -->
                  <UTooltip :text="isFavorite ? 'Remove from favorites' : 'Save to favorites'">
                    <UButton :color="isFavorite ? 'pink' : 'gray'" variant="ghost" size="lg"
                      :ui="{ rounded: 'rounded-full', padding: { lg: 'p-2' } }" @click="toggleFavorite">
                      <UIcon :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="w-5 h-5" />
                    </UButton>
                  </UTooltip>

                  <!-- Contact -->
                  <UTooltip text="Contact owner">
                    <UButton color="primary" variant="solid" size="lg"
                      :ui="{ rounded: 'rounded-full', padding: { lg: 'p-2' } }" @click="contactOwner"
                      class="hidden md:flex">
                      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5" />
                    </UButton>
                  </UTooltip>

                  <!-- Schedule Viewing -->
                  <!-- <UButton color="primary" variant="solid" size="lg" :disabled="!rental.is_available"
                    :ui="{ rounded: 'rounded-xl md:rounded-full' }" class="shadow-lg shadow-primary-500/30"
                    @click="scheduleViewing">
                    <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 md:mr-2" />
                    <span class="hidden md:inline">Schedule Viewing</span>
                    <span class="md:hidden">Book</span>
                  </UButton> -->
                </div>
              </div>
            </div>
          </div>
        </UContainer>
      </div>
    </div>

    <UDrawer v-model:open="isModalOpen" :overlay="false" :direction="screen.isMobile.value ? 'bottom' : 'right'"
      :ui="{ width: 'w-full max-w-6xl', padding: 'p-1' }" class="overflow-hidden z-100">
      <template #content>
        <div class="flex-1 p-2 w-full flex-col items-center  md:py-4">
          <UCarousel ref="carousel" v-slot="{ item }" :arrows="screen.isMobile.value ? false : true"
            dots  :items="allImages" :prev="{ onClick: onClickPrev }"
            :next="{ onClick: onClickNext }" class="w-full max-w-lg min-h-[50vh] mx-auto" :ui="{
              container: 'transition-[height]',
              controls: 'absolute -bottom-8 inset-x-12',
              dots: '-bottom-0',
              dot: 'w-6 h-1'
            }" @select="onSelect">
            <div class=" rounded-sm bg-gray-600/25 border w-full h-full overflow-hidden">
              <img :src="item.url" class="w-full h-full object-cover ">
            </div>
          </UCarousel>


              <div class="ml-3 z-101">{{activeIndex + 1}}/{{ allImages.length}}</div>

          <div class="border-t mt-5 md:mt-15 border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-4 w-full">
            <div class="
      flex gap-3 w-full overflow-x-auto overflow-y-hidden
      scroll-smooth snap-x snap-mandatory
      scrollbar-hide
    ">
              <div v-for="(item, index) in allImages" :key="index" class="flex-shrink-0 snap-start"
                @click="select(index)">
                <div class="
          w-24 h-24 rounded-xl overflow-hidden cursor-pointer
          border-2 transition-all duration-200
        " :class="activeIndex === index
          ? 'border-primary-500 ring-2 ring-primary-500/30'
          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
          ">
                  <img :src="item.url" :alt="`Thumbnail ${index + 1}`" class="
            w-full h-full object-cover
            transition-transform duration-300
            hover:scale-110
          " />
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>
    </UDrawer>




    <UModal v-model:open="showFullGallery">
      <template #content>
        <div class="p-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">All Photos ({{ allImages.length }})</h2>
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark"
              @click="showFullGallery = false" />
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div v-for="(img, index) in allImages" :key="index" @click="openModal(index)"
              class="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform">
              <img :src="img.url" :alt="img.caption" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </template>
    </UModal>


  </div>
</template>

<style scoped>
/* Custom scroll behavior */
html {
  scroll-padding-top: 120px;
}

/* Smooth transitions */
.sticky-enter-active,
.sticky-leave-active {
  transition: all 0.3s ease;
}

.sticky-enter-from,
.sticky-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Backdrop blur effect */
.backdrop-blur-lg {
  backdrop-filter: blur(12px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

/* Ensure content spacing */
.lg\:col-span-2 {
  padding-bottom: 140px;
}

/* Custom shadow for depth */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Glass morphism effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Smooth image zoom */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Progress bar animation */
.progress-bar {
  transition: width 1s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lg\:col-span-2 {
    padding-bottom: 100px;
  }
}
</style>