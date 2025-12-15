<template>
   <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto shrink-0" />
        </NuxtLink>

        <TemplateMenu />
      </template>

      <template #right>
        <LoggedIcon />
        <UColorModeButton />
      </template>
    </UHeader>
</template>
