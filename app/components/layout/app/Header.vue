<template>
   <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto shrink-0" />
        </NuxtLink>

        <TemplateMenu />
      </template>

      <template #right>
        <UColorModeButton />

      </template>
    </UHeader>
</template>
