<script lang="ts" setup>
import "./css/index.css";
import { SignUp } from "@clerk/vue";
import { db } from "./lib/db";
</script>

<template>
  <SignedOut>
    <SignUp />
  </SignedOut>
  <SignedIn>
    <UserButton />
    <NuxtPage />
  </SignedIn>
</template>
