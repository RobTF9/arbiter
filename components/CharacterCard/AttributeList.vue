<script lang="ts" setup>
defineProps<{
  title: string;
  attributes: { id: string; name: string; description: string | null }[];
}>();
</script>

<template>
  <div class="mt-4">
    <span class="font-bold text-sm text-(--ui-text-highlighted) mr-4">{{
      title
    }}</span>
    <UPopover
      v-for="({ id, description, name }, index) in attributes"
      :key="id"
      class="mr-1"
      mode="hover"
    >
      <template #content>
        <div class="bg-white dark:bg-gray-950 max-w-xs p-4 rounded">
          <p class="text-lg font-bold">{{ name }}</p>
          <p>
            {{ description }}
          </p>
        </div>
      </template>
      <template #default>
        <span class="text-sm">
          {{ name }}<span v-if="index < attributes?.length - 1">,</span>
        </span></template
      >
    </UPopover>
  </div>
</template>

<style scoped></style>
