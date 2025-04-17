<script setup lang="ts">
import type { Message } from "@prisma/client";

const props = defineProps<{ message: Message }>();

const sources = computed(() => {
  const sources = props.message.sources;
  if (!sources) return [];
  return JSON.parse(sources);
});
</script>

<template>
  <ul class="my-4">
    <h4 class="mb-2 font-bold">Sources</h4>
    <li v-for="source in sources" :key="source" class="mb-2">
      <a
        :href="`https://www.necroraw.ru${source}`"
        target="_blank"
        class="hover:underline text-xs opacity-65"
      >
        {{ source }}
      </a>
    </li>
  </ul>
</template>
