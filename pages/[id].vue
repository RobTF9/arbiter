<script setup lang="ts">
const route = useRoute();
const { data } = await useFetch(`/api/lists/${route.params.id}`);
const list = computed(() => data.value?.list);

console.log(list.value);
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
        <UButton color="neutral" icon="i-lucide-message" variant="ghost"
          >Edit List</UButton
        >
      </header>
      <USeparator />

      <!-- Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <UCard>
          <div class="text-center">
            <div class="text-sm text-gray-500 mb-1">Rating</div>
            <div class="text-2xl font-bold">{{ list.rating }}</div>
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
            <div class="text-2xl font-bold">{{ list.credits }}</div>
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
          <UCard
            v-for="character in list.characters"
            :key="character.id"
            class="relative mb-4"
          >
            <div class="flex items-start justify-between mb-4 gap-2">
              <h3 class="font-bold">{{ character.name }}</h3>
              <p class="text-gray-500 mr-auto">
                {{ character.profile }}
              </p>
              <UBadge variant="subtle" class="rounded-full"
                >{{ character.points }} points</UBadge
              >
            </div>
            <div class="grid grid-cols-13 gap-2 mb-4">
              <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">M</div>
                <div class="font-bold">{{ character.movement }}"</div>
              </div>
              <div class="text-center bg-gray-5 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">WS</div>
                <div class="font-bold">{{ character.weaponSkill }}+</div>
              </div>
              <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">BS</div>
                <div class="font-bold">{{ character.ballisticSkill }}+</div>
              </div>
              <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">S</div>
                <div class="font-bold">{{ character.strength }}</div>
              </div>
              <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">T</div>
                <div class="font-bold">{{ character.toughness }}</div>
              </div>
              <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">W</div>
                <div class="font-bold">{{ character.wounds }}</div>
              </div>
              <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">I</div>
                <div class="font-bold">{{ character.initiative }}+</div>
              </div>
              <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">A</div>
                <div class="font-bold">{{ character.attacks }}</div>
              </div>
              <div class="text-center bg-amber-50 dark:bg-gray-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">Ld</div>
                <div class="font-bold">{{ character.leaderShip }}+</div>
              </div>
              <div
                class="text-center bg-amber-50 dark:bg-amber-800 p-2 rounded"
              >
                <div class="text-xs text-gray-500 dark:text-gray-400">Cl</div>
                <div class="font-bold">{{ character.cool }}+</div>
              </div>
              <div
                class="text-center bg-amber-50 dark:bg-amber-800 p-2 rounded"
              >
                <div class="text-xs text-gray-500 dark:text-gray-400">Wil</div>
                <div class="font-bold">{{ character.willpower }}+</div>
              </div>
              <div
                class="text-center bg-amber-50 dark:bg-amber-800 p-2 rounded"
              >
                <div class="text-xs text-gray-500 dark:text-gray-400">Int</div>
                <div class="font-bold">{{ character.intelligence }}+</div>
              </div>
              <div class="text-center bg-red-100 dark:bg-red-800 p-2 rounded">
                <div class="text-xs text-gray-500 dark:text-gray-400">XP</div>
                <div class="font-bold">{{ character.xp }}</div>
              </div>
            </div>
            <div v-if="character.weapons && character.weapons.length > 0">
              <UTable
                :data="character.weapons"
                :columns="[
                  {
                    accessorKey: 'name',
                    header: 'Weapon',
                  },
                  {
                    accessorKey: 'shortRange',
                    header: 'Range S',
                  },
                  {
                    accessorKey: 'longRange',
                    header: 'Range L',
                  },
                  {
                    accessorKey: 'shortRangeModifier',
                    header: 'Acc S',
                    cell: ({ cell }) => `${cell.getValue()}+`,
                  },
                  {
                    accessorKey: 'longRangeModifier',
                    header: 'Acc L',
                    cell: ({ cell }) => `${cell.getValue()}+`,
                  },
                  {
                    accessorKey: 'strength',
                    header: 'Str',
                  },
                  {
                    accessorKey: 'damage',
                    header: 'D',
                  },
                  {
                    accessorKey: 'armorPiercing',
                    header: 'Ap',
                    cell: ({ cell }) => `-${cell.getValue()}`,
                  },
                  {
                    accessorKey: 'ammo',
                    header: 'Am',
                    cell: ({ cell }) => `${cell.getValue()}+`,
                  },
                ]"
              />
            </div>
            <div
              v-if="character.wargear && character.wargear.length > 0"
              class="mt-4"
            >
              <span class="font-bold text-sm text-(--ui-text-highlighted) mr-4"
                >Wargear</span
              >
              <span class="text-sm">{{
                character.wargear.map((w) => w.name).join(", ")
              }}</span>
            </div>
            <div
              v-if="character.skills && character.skills.length > 0"
              class="mt-4"
            >
              <span class="font-bold text-sm text-(--ui-text-highlighted) mr-4"
                >Skills</span
              >
              <span class="text-sm">{{
                character.skills.map((w) => w.name).join(", ")
              }}</span>
            </div>
          </UCard>
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
