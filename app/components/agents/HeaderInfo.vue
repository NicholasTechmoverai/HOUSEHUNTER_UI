<template>
    <div>
        <div>
            <p>Agency name</p>
            <UInput v-model="value" />
        </div>
        <div>
            <p>Agency name</p>
            <UInputMenu v-model="value" :items="items" />
        </div>
        <div>
            <p>Agency name</p>
            <UFileUpload v-model="profile_picture" class="w-96 min-h-48" />
        </div>
        <div>
            <p>Agency name</p>
  <UTextarea color="neutral" highlight placeholder="Type something..." />
        </div>
       


    </div>
</template>


<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
const profile_picture = ref<File | null>(null)
</script>