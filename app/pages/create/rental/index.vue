<script setup lang="ts">
const files = ref<File[]>([])
const rules = ref<File[]>([])
const amenities = ref<File[]>([])


const rulesContent = ref('')
const propertyRules = ref([])
const hasUnsavedChanges = ref(false)

async function savePropertyRules() {
    // Save to API
    console.log('Saving rules:', { content: rulesContent.value, rules: propertyRules.value })
}

function handleRulesUpdate(rules) {
    propertyRules.value = rules
    console.log('Rules updated:', rules)
}


const updateFiles = (payload: File[]) => {
    files.value = payload
}

const updateRules = (payload: []) => {
    rules.value = payload
}

const updateAmenities = (payload: []) => {
    amenities.value = payload
}
</script>

<template>
    <FileUploader @change="updateFiles" />

    <RulesUploader v-model="rulesContent" :rules="propertyRules" mode="advanced" @save="savePropertyRules"
        @update:rules="handleRulesUpdate" @change="hasUnsavedChanges = $event" />

    <!-- Optional / future -->
    <!-- <AmenitiesUploader @change="updateAmenities" /> -->
</template>
