<template>
  <UApp>
    <Header />

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />
    <Footer />
  </UApp>
</template>

<script setup>
import Header from '~/components/layout/app/Header.vue'
import Footer from '~/components/layout/app/Footer.vue'
</script>
