<template>
  <div>
    <div class="m-3 space-y-2 flex-col md:fl">
      <NavigationBreadCrumb />
      <div>
        <SearchCard v-model="searchQuery" search-type="property" placeholder="Search properties..."
          @search="handleSearch" @clear="handleClear" />
      </div>
    </div>
    <div>
      <RentalLayout />
    </div>
  </div>
</template>


<script setup>
const searchQuery = ref('')
definePageMeta({
  breadcrumb: {
    label: 'Rentals',
    icon: 'i-lucide-building'
  }
})




const handleSearch = (query) => {
  console.log('Searching for:', query)
  // Call your search API
}

const handleClear = () => {
  console.log('Search cleared')
}

</script>