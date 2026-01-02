<template>
    <div class="w-full">
        <UPageCard title="Global Intelligence Search" :description="description" orientation="horizontal" :spotlight="true"
            spotlight-color="primary"
            class="w-full max-w-4xl mx-auto overflow-hidden group cursor-pointer border border-transparent hover:border-primary-500/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/5"
            :ui="{
                body: { base: 'flex-1 p-6' },
                wrapper: 'relative transition-all duration-500'
            }" @click="openSearch">
            <div class="w-full space-y-3">
                <div @click="openSearch" class="relative w-full group/trigger">
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 opacity-0 group-hover/trigger:opacity-100 transition-opacity duration-700 rounded-2xl" />

                    <div
                        class="relative h-14 w-full px-4 flex items-center gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 group-hover/trigger:border-primary-500/50 transition-all duration-300 shadow-sm group-hover/trigger:shadow-md">

                        <div class="relative">
                            <div
                                class="absolute inset-0 bg-primary-500/10 rounded-full scale-0 group-hover/trigger:scale-100 transition-transform duration-500" />
                            <UIcon :name="loading ? 'i-lucide-loader-2' : 'i-lucide-search'"
                                class="relative z-10 w-6 h-6 text-primary-500 transition-transform group-hover/trigger:scale-110"
                                :class="{ 'animate-spin': loading }" />
                        </div>

                        <div class="flex-1 min-w-0 overflow-hidden">
                            <div class="flex items-center">
                                <span
                                    class="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px] md:max-w-none">
                                    {{ displayText }}
                                </span>
                                <span
                                    class="inline-block w-[2px] h-6 bg-primary-500 ml-0.5 animate-pulse flex-shrink-0" />
                            </div>
                            <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                                Click or press <UKbd class="text-xs">/</UKbd> to open search
                            </div>
                        </div>

                        <div class="flex items-center gap-2 flex-shrink-0">
                            <UTooltip text="Voice Search">
                                <UButton v-if="supportsVoice" icon="i-lucide-mic" color="primary" variant="soft"
                                    size="sm" :ui="{ rounded: 'rounded-full' }"
                                    class="relative overflow-hidden hover:scale-110 transition-all duration-300"
                                    @click.stop="startVoiceSearch">
                                    <div
                                        class="absolute inset-0 bg-primary-500/20 rounded-full animate-ping opacity-0 hover:opacity-100" />
                                </UButton>
                            </UTooltip>

                            <UKbd
                                class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                                /
                            </UKbd>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 pt-1">
                    <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-2">
                        Popular:
                    </div>
                    <UBadge v-for="(tag, index) in allSuggestions.slice(0, 5)" :key="tag" color="primary"
                        variant="subtle" size="sm" :ui="{ rounded: 'rounded-full' }"
                        class="cursor-pointer hover:scale-105 transition-all duration-300 font-medium px-3 py-1 group/badge"
                        @click.stop="selectQuery(tag)">
                        <span class="truncate max-w-[120px] md:max-w-none">{{ tag }}</span>
                        <UIcon name="i-lucide-arrow-right"
                            class="w-3 h-3 ml-1 opacity-0 group-hover/badge:opacity-100 transition-all duration-300" />
                    </UBadge>
                </div>
            </div>
        </UPageCard>

        <Teleport to="body">
            <Transition name="voice-modal">
                <div v-if="isListening"
                    class="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-gray-950/95 via-gray-900/95 to-gray-950/95 backdrop-blur-xl"
                    @click.stop="stopVoiceSearch">
                    <div class="max-w-lg w-full text-center px-6">
                        <div class="relative mb-10">
                            <div v-for="i in 4" :key="i"
                                class="absolute inset-0 m-auto w-0 h-0 border-2 border-primary-400/30 rounded-full animate-ping"
                                :style="{
                                    width: `${100 + i * 80}px`,
                                    height: `${100 + i * 80}px`,
                                    animationDelay: `${i * 0.2}s`,
                                    animationDuration: '2.5s'
                                }" />

                            <div class="relative flex justify-center items-center">
                                <div
                                    class="absolute w-64 h-64 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-full animate-pulse" />
                                <div
                                    class="relative bg-gradient-to-br from-primary-500 via-primary-400 to-primary-300 p-12 rounded-full shadow-2xl shadow-primary-500/40">
                                    <UIcon name="i-lucide-mic" class="w-20 h-20 text-white" />
                                </div>
                            </div>
                        </div>

                        <h2
                            class="text-4xl font-black text-white tracking-tight mb-6 bg-gradient-to-r from-primary-400 via-primary-300 to-primary-400 bg-clip-text text-transparent">
                            VOICE SEARCH ACTIVE
                        </h2>

                        <div
                            class="min-h-[80px] bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 backdrop-blur-sm">
                            <div class="flex items-center justify-center gap-3 mb-2">
                                <UIcon name="i-lucide-mic" class="w-5 h-5 text-primary-400 animate-pulse" />
                                <span
                                    class="text-sm text-primary-300 font-semibold uppercase tracking-wider">LISTENING</span>
                            </div>
                            <p class="text-2xl text-white font-medium leading-relaxed truncate">
                                "{{ voiceTranscript || 'Speak now... I\'m listening' }}"
                            </p>
                        </div>

                        <UButton color="white" variant="solid" size="xl"
                            class="rounded-full px-16 font-bold shadow-2xl hover:scale-105 transition-all duration-300"
                            @click.stop="stopVoiceSearch">
                            <UIcon name="i-lucide-stop-circle" class="w-6 h-6 mr-2" />
                            Stop Recording
                        </UButton>

                        <p class="text-sm text-gray-400 mt-6">
                            Click anywhere or say "stop" to finish
                        </p>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <UDrawer v-model:open="isOpen" :direction="screen.isMobile.value  ? 'bottom' : 'right'" :ui="{
            overlay: { background: 'bg-gray-900/80 backdrop-blur-sm' },
            wrapper: 'h-[85vh] rounded-b-3xl overflow-hidden',
            container: 'bg-white dark:bg-gray-900',
            transition: {
                enterActiveClass: 'transition-all duration-500 ease-out',
                leaveActiveClass: 'transition-all duration-300 ease-in',
                enterFromClass: 'opacity-0 -translate-y-10 scale-95',
                leaveToClass: 'opacity-0 -translate-y-10 scale-95'
            }
        }">
            <template #header>
                <div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                    <div class="flex items-center gap-3">
                        <UIcon name="i-lucide-search" class="w-6 h-6 text-primary-500" />
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Find anything instantly</p>
                        </div>
                    </div>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="isOpen = false" />
                </div>
            </template>

            <template #content>
                <SearchDrawer :initial-query="searchQuery" @close="isOpen = false" @search="performSearch" />
            </template>

        </UDrawer>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue?: string
    description?: string
}>()
const screen = useScreenSize()

const emit = defineEmits(['update:modelValue', 'search'])

// State
const isOpen = ref(false)
const loading = ref(false)
const searchQuery = ref(props.modelValue || '')
const isListening = ref(false)
const voiceTranscript = ref('')
const supportsVoice = ref(false)

// Typewriter
const displayText = ref('')
const allSuggestions = [
    'Modern Villas',
    'Studio Apartments',
    'Luxury Penthouses',
    'Beachfront Properties PropertiesProperties',
    'Office Space',
    'Gated Community'
]

let typeIndex = 0
let charIndex = 0
let isDeleting = false
let typeTimeout: NodeJS.Timeout | null = null

const typeEffect = () => {
    const currentFullText = allSuggestions[typeIndex]

    if (isDeleting) {
        displayText.value = currentFullText.substring(0, charIndex - 1)
        charIndex--
    } else {
        displayText.value = currentFullText.substring(0, charIndex + 1)
        charIndex++
    }

    let typeSpeed = isDeleting ? 50 : 100

    if (!isDeleting && charIndex === currentFullText.length) {
        isDeleting = true
        typeSpeed = 1500
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        typeIndex = (typeIndex + 1) % allSuggestions.length
        typeSpeed = 300
    }

    if (typeTimeout) clearTimeout(typeTimeout)
    typeTimeout = setTimeout(typeEffect, typeSpeed)
}

// Methods
const openSearch = () => {
    isOpen.value = true
    setTimeout(() => {
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
        if (searchInput) searchInput.focus()
    }, 100)
}

const selectQuery = (query: string) => {
    searchQuery.value = query
    performSearch(query)
    isOpen.value = true
}

const performSearch = (query: string) => {
    loading.value = true
    emit('search', query)
    setTimeout(() => { loading.value = false }, 1500)
}

const startVoiceSearch = () => {
    const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRec) return

    const rec = new SpeechRec()
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onstart = () => { isListening.value = true }
    rec.onresult = (e: any) => { voiceTranscript.value = e.results[0][0].transcript }
    rec.onend = () => {
        if (voiceTranscript.value) selectQuery(voiceTranscript.value)
        isListening.value = false
        voiceTranscript.value = ''
    }
    rec.start()
}

const stopVoiceSearch = () => {
    isListening.value = false
    voiceTranscript.value = ''
}

// Keybindings
const handleGlobalKeys = (e: KeyboardEvent) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        openSearch()
    }

    if (e.key === 'Escape' && isOpen.value) {
        e.preventDefault()
        isOpen.value = false
    }
}

onMounted(() => {
    supportsVoice.value = !!((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition)
    window.addEventListener('keydown', handleGlobalKeys)
    setTimeout(typeEffect, 500)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeys)
    if (typeTimeout) clearTimeout(typeTimeout)
})

watch(() => props.modelValue, (newVal) => {
    if (newVal !== undefined) searchQuery.value = newVal
})

watch(searchQuery, (newVal) => {
    emit('update:modelValue', newVal)
})

const router = useRouter()
const route = useRoute()

/* URL → UI */
watch(
  () => route.query.search,
  (search) => {
    const shouldBeOpen = search === 'true'
    if (isOpen.value !== shouldBeOpen) {
      isOpen.value = shouldBeOpen
    }
  },
  { immediate: true }
)

/* UI → URL */
watch(isOpen, (open) => {
  const query = { ...route.query }

  if (open) {
    if (query.search !== 'true') {
      query.search = 'true'
      router.push({ query })
    }
  } else {
    if ('search' in query) {
      delete query.search
      router.push({ query })
    }
  }
})

</script>

<style scoped>
.voice-modal-enter-active,
.voice-modal-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.voice-modal-enter-from,
.voice-modal-leave-to {
    opacity: 0;
    transform: scale(1.1);
    filter: blur(20px);
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}
</style>