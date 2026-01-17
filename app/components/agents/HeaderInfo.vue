<template>
    <div class="space-y-8">
        <UCard class=" shadow-sm">
            <template #header>
                <h3 class="text-lg font-semibold text-gray-900">Agency Details</h3>
                <p class="text-sm text-gray-500 mt-1">Update your agency information</p>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Agency Name -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        Agency Name <span class="text-red-500">*</span>
                    </label>
                    <UInput v-model="agencyName" placeholder="Enter agency name" size="lg"
                        icon="i-heroicons-building-office" :ui="{ base: 'w-full' }" />
                </div>

                <!-- Agency Status -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        Agency Status
                    </label>
                    <USelectMenu v-model="selectedStatus" :items="statusItems" size="lg" placeholder="Select status"
                        icon="i-heroicons-flag" :ui="{ width: 'w-full' }" />
                </div>
            </div>

            <!-- Agency Logo -->
            <div class="mt-6 space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    Agency Logo
                </label>
                <UFileUpload v-model="agencyLogo" class="w-96 min-h-48" />

                <p class="text-xs text-gray-500 mt-2">Recommended: 500x500px PNG or JPG, max 5MB</p>
            </div>

            <!-- Agency Description -->
            <div class="mt-6 space-y-2 w-full">
                <label class="block text-sm font-medium text-gray-700">
                    Agency Description <span class="text-red-500">*</span>
                </label>
                <UTextarea v-model="description" color="neutral" variant="outline" class="w-full"
                    placeholder="Describe your agency services, mission, and values..." :rows="6"
                    :ui="{ base: 'w-full resize-none w-full' }" autoresize />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Brief description helps clients understand your business</span>
                    <span>{{ description.length }}/500</span>
                </div>
            </div>


        </UCard>
    </div>
</template>

<script setup lang="ts">
const agencyName = ref('')
const description = ref('')
const agencyLogo = ref<File[]>([])

const statusItems = [
    { label: 'Backlog', value: 'Backlog' },
    { label: 'Todo', value: 'Todo' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' }
]
const selectedStatus = ref('Backlog')
</script>