<script setup lang="ts">
// Components are automatically imported
</script>

<template>
  <SignedOut>
    <SignInButton />
  </SignedOut>
  <SignedIn>
    <UserButton />
    <NuxtPage />
  </SignedIn>
</template>
