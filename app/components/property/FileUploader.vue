<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const toast = useToast()

const viewLayout = ref<'grid' | 'list'>('grid')
const isSaving = ref<boolean>(false)
const props = defineProps<{
    modelValue: File[] | null
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', files: File[]): void
    (e: 'reset'): void
    (e: 'save'): void
}>()

const files = computed({
    get: () => props.modelValue || [],
    set: (value: File[]) => {
        emit('update:modelValue', value)
    }
})

const MAX_IMAGE_SIZE_MB = 50

const IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg'
]

const VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime'
]

const isImage = (file: File) => IMAGE_TYPES.includes(file.type)
const isVideo = (file: File) => VIDEO_TYPES.includes(file.type)

const validateFiles = (incoming: File[]) => {
    const valid: File[] = []

    for (const file of incoming) {
        if (isImage(file)) {
            if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                toast.add({
                    title: 'Image too large',
                    message: `${file.name} exceeds ${MAX_IMAGE_SIZE_MB}MB`,
                    color: 'error'
                })
                continue
            }
            valid.push(file)
            continue
        }

        if (isVideo(file)) {
            valid.push(file)
            continue
        }

        toast.add({
            title: 'Unsupported file',
            message: `${file.name} is not an image or video`,
            color: 'error'
        })
    }

    return valid
}



const handleSave = async () => {
    isSaving.value = true
    const validated = validateFiles(files.value)

    if (validated.length !== files.value.length) {
        files.value = validated
    }

    emit('save')
    isSaving.value = false
}

const items = computed(() => [
    {
        label: 'View layout',
        icon: 'i-lucide-layout-grid',
        children: [
            {
                label: 'Grid view',
                icon: 'i-lucide-grid',
                type: 'checkbox' as const,
                checked: viewLayout.value === 'grid',
                onUpdateChecked(checked: boolean) {
                    viewLayout.value = 'grid'
                },
            },
            {
                label: 'List view',
                icon: 'i-lucide-list',
                type: 'checkbox' as const,
                checked: viewLayout.value === 'list',
                onUpdateChecked(checked: boolean) {
                    viewLayout.value = 'list'
                },
            }
        ]
    }
] satisfies DropdownMenuItem[])

</script>

<template>
    <div class="space-y-4 flex flex-col m-2 border border-gray-200 dark:border-gray-800 p-2 rounded-md items-center">
        <div class="flex flex-row justify-around gap-2">
            <UFieldGroup>
                <UButton label="Upload settings" icon="i-lucide-settings" color="neutral" variant="subtle" />
                <UDropdownMenu :items="items">
                    <UButton icon="i-lucide-chevron-down" color="neutral" variant="outline" />
                </UDropdownMenu>
            </UFieldGroup>
            <UButton color="primary" size="sm" :loading="isSaving" icon="i-heroicons-check-circle" @click="handleSave">
                Save
            </UButton>
        </div>


        <UFileUpload v-model="files" :layout="viewLayout" multiple :interactive="false" icon="i-lucide-image"
            label="Property media" description="Images up to 50MB and videos (no size limit)"
            class="w-full max-w-[900px] min-h-[12rem]">
            <template #actions="{ open }">
                <UButton label="Select files" icon="i-lucide-upload" color="neutral" variant="outline"
                    @click="open()" />
            </template>

            <template #files-top="{ open, files }">
                <div v-if="files?.length" class="mb-2 flex items-center justify-between text-sm">
                    <span class="font-medium">
                        {{ files.length }} file{{ files.length > 1 ? 's' : '' }} selected
                    </span>

                    <UButton label="Add more" icon="i-lucide-plus" size="xs" color="neutral" variant="ghost"
                        @click="open()" />
                </div>
            </template>

            <template #files-bottom="{ removeFile, files }">
                <UButton v-if="files?.length" label="Remove all" icon="i-lucide-trash" size="xs" color="red"
                    variant="ghost" @click="removeFile()" />
            </template>
        </UFileUpload>
    </div>
</template>
