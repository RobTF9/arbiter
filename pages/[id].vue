<script setup lang="ts">
const route = useRoute();
const { data, refresh } = await useFetch(`/api/lists/${route.params.id}`);
const list = computed(() => data.value?.list);

// Compute the total rating based on characters, weapons, wargear, and advancements
// Compute the total rating based on characters
const computedRating = computed(() => {
  if (!list.value?.characters || list.value.characters.length === 0) {
    return 0;
  }

  return list.value.characters.reduce((total, character) => {
    // Add character base points
    let characterTotal = character.points || 0;

    characterTotal +=
      (character.weapons || []).reduce((weaponTotal, weapon) => {
        // Add weapon points
        return weaponTotal + (weapon.credits || 0);
      }, 0) +
      (character.wargear || []).reduce((wargearTotal, wargear) => {
        // Add wargear points
        return wargearTotal + (wargear.credits || 0);
      }, 0) +
      (character.advancements || []).reduce((advancementTotal, advancement) => {
        // Add skill points
        return advancementTotal + (advancement.cost || 0);
      }, 0);

    // We don't add points from weapons, wargear, and skills directly
    // as they don't have a points property in the schema
    // Instead, their cost is already included in the character's points

    return total + characterTotal;
  }, 0);
});

const computedCredits = computed(() => {
  return list.value?.credits - computedRating.value;
});

const assistantOpen = ref(false);
</script>

<template>
  <UContainer class="space-y-8">
    <!-- Header Section -->
    <div v-if="list">
      <header class="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold">{{ list.title }}</h1>
            <UBadge color="primary" variant="subtle" class="text-sm">{{
              list.gang
            }}</UBadge>
          </div>
          <p v-if="list.description" class="text-gray-500">
            {{ list.description }}
          </p>
        </div>
        <USlideover v-model:open="assistantOpen" :overlay="false">
          <UButton
            color="neutral"
            icon="i-lucide-sparkles"
            variant="ghost"
            @click="assistantOpen = true"
            >Assistant</UButton
          >
          <template #header>
            <UIcon name="i-lucide-sparkles" class="size-5" />
            <h2 class="text-lg font-bold">Assistant</h2>
            <UButton
              icon="i-lucide-arrow-right"
              class="ml-auto"
              variant="ghost"
              color="neutral"
              @click="assistantOpen = false"
            />
          </template>
          <template #body>
            <AssistantDialogue
              :list-id="list.id"
              :messages="list.messages"
              @clear-messages="refresh"
              @polling-finished="refresh"
            />
          </template>
        </USlideover>
      </header>
      <USeparator />

      <!-- Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <UCard>
          <div class="text-center">
            <div class="text-sm text-gray-500 mb-1">Rating</div>
            <div class="text-2xl font-bold">{{ computedRating }}</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-sm text-gray-500 mb-1">Reputation</div>
            <div class="text-2xl font-bold">{{ list.reputation }}</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-sm text-gray-500 mb-1">Credits</div>
            <div class="text-2xl font-bold">{{ computedCredits }}</div>
          </div>
        </UCard>
      </div>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">
            Characters ({{ list._count?.characters || 0 }})
          </h2>
        </div>
        <div v-if="!list.characters || list.characters.length === 0">
          <p class="text-gray-500">
            No characters yet. Add your first character to get started.
          </p>
        </div>
        <div v-else>
          <CharacterCard
            v-for="character in list.characters"
            :key="character.id"
            :character="character"
            :list-id="list.id"
            @polling-finished="refresh"
          />
        </div>
      </div>
    </div>
    <div v-else class="py-8 text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin h-8 w-8 mx-auto mb-4"
      />
      <p>Loading list data...</p>
    </div>
  </UContainer>
</template>
