<template>
    <div>
        <UPageCard icon="i-simple-icons-tailwindcss" orientation="horizontal" spotlight spotlight-color="primary">
            <UPopover mode="hover">
                <UInput v-model="value" loading placeholder="Type something..." :ui="{ trailing: 'pe-1' }">
                    <template v-if="value?.length" #trailing>
                        <UButton color="neutral" variant="link" size="md" icon="i-lucide-circle-x"
                            aria-label="Clear input" @click="value = ''" />
                    </template>
                </UInput>
                <template #content>
                    <Placeholder class="size-48 m-4 inline-flex" />
                </template>
            </UPopover>

        </UPageCard>
    </div>
</template>

<script setup lang="ts">
const value = ref('')
</script>