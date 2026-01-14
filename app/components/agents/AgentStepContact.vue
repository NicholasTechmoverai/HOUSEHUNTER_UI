<script setup lang="ts">
const phone = ref('')
const countryCodes = ref(['+254', '+255', '+256'])
const selectedCountryCode = ref(countryCodes.value[0])
</script>

<template>
  <UFieldGroup>
    <UInput
      v-model="phone"
      placeholder="nuxt"
      :ui="{
        base: 'pl-14.5',
        leading: 'pointer-events-none'
      }"
    >
      <template #leading>
        <p class="text-sm text-muted">
          {{ selectedCountryCode }}
        </p>
      </template>
    </UInput>

    <USelectMenu v-model="selectedCountryCode" :items="countryCodes" />
  </UFieldGroup>

  <UFieldGroup>
    <UBadge color="neutral" variant="outline" size="lg" label="https://" />

    <UInput color="neutral" variant="outline" placeholder="www.example.com" />
  </UFieldGroup>

  <UFieldGroup>
    <UInput color="neutral" variant="outline" placeholder="24" />

    <UInput color="neutral" variant="outline" placeholder="www.example.com" />
  </UFieldGroup>
</template>
