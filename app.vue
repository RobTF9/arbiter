<script lang="ts" setup>
import { SignUp } from "@clerk/vue";
import { TooltipProvider } from "reka-ui";
</script>

<template>
  <TooltipProvider>
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
  </TooltipProvider>
</template>
