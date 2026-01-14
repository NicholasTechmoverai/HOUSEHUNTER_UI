<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import HeaderInfo from '~/components/agents/HeaderInfo.vue'
import AgentStepContact from '~/components/agents/AgentStepContact.vue'

const route = useRoute()
const { post } = useApi()
const endpoints = useEndpoints()
const userStore = useUserStore()
const hasAnAccount = ref(false)

const { data: userData, pending, error } = await useAsyncData(
    `user_profile_${route.params.id}`,
    async () => {
        try {
            const response = await post(endpoints.agent.init(userStore.user.public_id), {}, true)
            hasAnAccount.value = response.hasAnAccount || false
            return response.success ? response.data : null
        } catch (err) {
            console.error('Error fetching profile:', err)
            return null
        }
    }
)

watchEffect(() => {
    if (userData.value) {
        useSeo({
            title: 'create agent profile - ' + (userData.value.name || 'User Profile'),
            description: 'create agent profile,manage properties and more',
            image: undefined
        })
    }
})


const items: StepperItem[] = [
  {
    title: 'Basic information',
    description: 'Personal and professional details',
    icon: 'i-lucide-user',
    component: HeaderInfo
  },
  {
    title: 'Contact details',
    description: 'Phone, email, and social links',
    icon: 'i-lucide-phone',
    component: AgentStepContact
  },
  {
    title: 'Location',
    description: 'Service area and address',
    icon: 'i-lucide-map-pin',
    component: 'AgentStepLocation'
  },
  {
    title: 'Verification',
    description: 'Identity and compliance checks',
    icon: 'i-lucide-shield-check',
    component: 'AgentStepVerification'
  },
  {
    title: 'Review & submit',
    description: 'Confirm and create agent profile',
    icon: 'i-lucide-check-circle',
    component: 'AgentStepReview'
  }
]


const stepper = useTemplateRef('stepper')
const active = ref(0)
const toaster = useToast()

const handleNext = () => {
    if (!stepper.value) return
    const nextStep = stepper.value.hasNext

    if (nextStep) {
        toaster.add({
            title: 'Continue to next step',
            icon: 'i-lucide-arrow-big-right-dash',
            color: 'primary',
            duration: 3000
        })
    }

    stepper.value.next()
}

</script>

<template>
    <div>
        <div>
            <p>{{ userData?.email }}</p>
        </div>
        <div v-if="hasAnAccount" class="mb-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">
            You already have an agent profile. 
            <NuxtLink to="/account/{{ userStore.user.public_id }}/agent" class="underline font-semibold">
                Click here to view your agent profile.
            </NuxtLink>
        </div>
         <div v-else class="w-full">
        <UStepper ref="stepper" :items="items">
            <template #content="{ item }">
                <Placeholder class="aspect-video">
                    {{ item.title }}
                    <div class="mt-6" data-aos="fade-up" data-aos-delay="100">
                        <component :is="item.component" />
                    </div>
                </Placeholder>
            </template>
        </UStepper>

        <div class="flex gap-2 justify-between mt-4">
            <UButton leading-icon="i-lucide-arrow-left" :disabled="!stepper?.hasPrev" @click="stepper?.prev()">
                Prev
            </UButton>

            <UButton trailing-icon="i-lucide-arrow-right" :disabled="!stepper?.hasNext" @click="handleNext">
                Next
            </UButton>
        </div>
    </div>
    </div>
   
</template>
