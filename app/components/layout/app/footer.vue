<template>
  <footer class="bg-white/0 dark:bg-gray-950/0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      <div class="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        <div class="flex items-center gap-3">
          <AppLogo :size="3" />

          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ config.site.name }}
            </h2>

            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ config.site.description }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <UButton v-for="(item, i) in config.links.social" :key="i" :to="item.to" :target="item.target" color="gray"
            variant="ghost" size="sm" :aria-label="item.label"
            class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <UIcon :name="item.icon" class="w-5 h-5" />
          </UButton>
        </div>
      </div>

      <div class="mx-auto w-full px-2 sm:px-6 lg:px-8 py-2 space-y-12">

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 text-center sm:text-left">
          <div v-for="(group, i) in config.links.navigation" :key="i" class="space-y-3">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {{ group.label }}
            </h4>

            <ul class="space-y-2">
              <li v-for="link in group.links" :key="link.label" class="flex justify-center sm:justify-start">
                <NuxtLink :to="link.to"
                  class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <UIcon v-if="link.icon" :name="link.icon" class="w-3 h-3" />
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>

          </div>


          <!-- ........................... -->
          <div>
            <h3 class="font-semibold mb-4">Stay Connected</h3>
            <p class="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for property updates and tips.
            </p>
            <div class="flex gap-2">
              <UInput placeholder="Your email" size="sm" class="flex-1" :ui="{
                padding: { sm: 'px-3 py-2' },
                color: {
                  gray: {
                    outline: 'bg-gray-800 border-gray-700'
                  }
                }
              }" />
              <UButton size="sm" class="bg-gradient-to-r from-brand-start via-brand-middle to-brand-end">
                Subscribe
              </UButton>
            </div>
          </div>
        </div>


        <div class="flex flex-wrap justify-center items-center gap-5">
          <NuxtLink v-for="(item, i) in config.links.misc" :key="i" :to="item.to"
            class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            <UIcon :name="item.icon" class="w-3 h-3" />
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-800"></div>

      <div class="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 text-sm">
        <p class="text-gray-500 dark:text-gray-400">
          © {{ year }} {{ config.site.name }}. All rights reserved.
        </p>

        <div class="flex flex-wrap justify-center items-center gap-6">
          <UButton v-for="(link, i) in config.links.legal" :key="i" variant="link" color="white" :to="link.to"
            class="p-0 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <UIcon v-if="link.icon" :name="link.icon" class="w-3 h-3" />
            {{ link.label }}
          </UButton>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
const config = useAppConfig()
const year = new Date().getFullYear()
</script>
