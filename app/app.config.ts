export default defineAppConfig({
  ui: {
    colors: {
      // Add custom brand colors here if needed
      // primary: 'blue',
      // secondary: '#1A73E8',
      // neutral: '#F5F5F5',
    },
    bgColors: {
      brand: {
        start: '#059669',
        middle: '#10B981',
        end: '#0D9488',
      }
    },

    borderRadius: '0.5rem',
    shadows: {
      card: '0 2px 10px rgba(0,0,0,0.1)'
    }
  },

  site: {
    name: 'HouseHunter',
    url: 'https://househunter.com',
    description: 'Explore and list amazing real estate properties worldwide.',
    apiBase: 'https://api.tera-in.top',
    // apiBase: 'http://localhost:8000',
    themeColor: '#FF5733',
    defaultImage: '/logo.png',
    favicon: '/f_logo.png',
  },

  links: {
    navigation: [
      {
        label: 'Quick links',
        links: [
          { label: 'Property', to: '/property', icon: 'i-heroicons-home-modern' },
          { label: 'For Rent', to: '/rentals', icon: 'i-heroicons-key' },
          { label: 'Swap', to: '/swap', icon: 'i-heroicons-arrow-path-rounded-square' },
          { label: 'Near Me', to: '/near-me', icon: 'i-heroicons-map-pin' }
        ]
      },
      {
        label: 'Resources',
        links: [
          { label: 'Documentation', to: '/docs', icon: 'i-heroicons-book-open' },
          { label: 'Pricing', to: '/pricing', icon: 'i-heroicons-credit-card' }
        ]
      },
      {
        label: 'Company',
        links: [
          { label: 'About Us', to: '/about', icon: 'i-heroicons-building-office-2' },
          { label: 'Support', to: '/support', icon: 'i-heroicons-lifebuoy' }
        ]
      }
    ],

    social: [
      {
        to: 'https://twitter.com',
        label: 'X (Twitter)',
        icon: 'i-simple-icons-x',
        target: '_blank'
      },
      {
        to: 'https://linkedin.com',
        label: 'LinkedIn',
        icon: 'i-simple-icons-linkedin',
        target: '_blank'
      }
    ],

    legal: [
      { label: 'Privacy Policy', to: '/privacy', icon: 'i-heroicons-shield-check' },
      { label: 'Terms of Service', to: '/terms', icon: 'i-heroicons-document-text' }
    ],

    misc: [
      { label: 'Documentation', icon: 'i-heroicons-book-open', to: '/docs' },
      { label: 'Pricing', icon: 'i-heroicons-credit-card', to: '/pricing' },
      { label: 'Company', icon: 'i-heroicons-building-office', to: '/about' },
      { label: 'Support', icon: 'i-heroicons-lifebuoy', to: '/support' }
    ]
  }

})
