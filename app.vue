<script lang="ts" setup>
import { SignUp } from "@clerk/vue";
</script>

<template>
  <UApp>
    <SignedOut>
      <SignUp />
    </SignedOut>
    <SignedIn>
      <UContainer class="min-h-[44px] flex py-2 justify-between">
        <ULink :active="false" :href="`/`" class="font-bold">Arbiter</ULink>
        <UserButton />
      </UContainer>
      <USeparator class="mb-6" />
      <NuxtPage />
    </SignedIn>
  </UApp>
</template>
