<script lang="ts" setup>
import type {
  Advancement,
  Character,
  Injury,
  Skill,
  Wargear,
  Weapon,
} from "@prisma/client";
import AttributeList from "./AttributeList.vue";

const props = defineProps<{
  character: Character & {
    weapons: Weapon[];
    wargear: Wargear[];
    skills: Skill[];
    advancements: Advancement[];
    injuries: Injury[];
  };
}>();

const rating = computed(() => {
  const basePoints = props.character.points || 0;
  const weaponsPoints = props.character.weapons.reduce(
    (total, weapon) => total + (weapon.credits || 0),
    0
  );
  const wargearPoints = props.character.wargear.reduce(
    (total, wargear) => total + (wargear.credits || 0),
    0
  );
  const advancementPoints = props.character.advancements.reduce(
    (total, advancement) => total + (advancement.cost || 0),
    0
  );

  return basePoints + weaponsPoints + wargearPoints + advancementPoints;
});
</script>

<template>
  <UCard class="relative mb-4">
    <div class="flex items-start justify-between mb-4 gap-2">
      <h3 class="font-bold">{{ character.name }}</h3>
      <p class="text-gray-500 mr-auto">
        {{ character.profile }}
      </p>
      <UBadge variant="subtle" class="rounded-full">{{ rating }} rating</UBadge>
    </div>
    <div class="grid grid-cols-13 gap-2 mb-4">
      <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
        <div class="text-xs text-gray-500 dark:text-gray-400">M</div>
        <div class="font-bold">{{ character.movement }}"</div>
      </div>
      <div class="text-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
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
      <div class="text-center bg-amber-50 dark:bg-amber-800 p-2 rounded">
        <div class="text-xs text-gray-500 dark:text-gray-400">Cl</div>
        <div class="font-bold">{{ character.cool }}+</div>
      </div>
      <div class="text-center bg-amber-50 dark:bg-amber-800 p-2 rounded">
        <div class="text-xs text-gray-500 dark:text-gray-400">Wil</div>
        <div class="font-bold">{{ character.willpower }}+</div>
      </div>
      <div class="text-center bg-amber-50 dark:bg-amber-800 p-2 rounded">
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
    <AttributeList
      v-if="character.wargear && character.wargear.length > 0"
      title="Wargear"
      :attributes="character.wargear"
    />
    <AttributeList
      v-if="character.skills && character.skills.length > 0"
      title="Skills"
      :attributes="character.skills"
    />
    <AttributeList
      v-if="character.advancements && character.advancements.length > 0"
      title="Advancements"
      :attributes="character.advancements"
    />
    <AttributeList
      v-if="character.injuries && character.injuries.length > 0"
      title="Injuries"
      :attributes="character.injuries"
    />
  </UCard>
</template>
