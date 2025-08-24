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
import StatField from "./StatField.vue";

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
      <StatField
        color="gray"
        label="M"
        key="movement"
        :value="character.movement"
      />
      <StatField
        color="gray"
        label="WS"
        key="weaponSkill"
        :value="`${character.weaponSkill}+`"
      />
      <StatField
        color="gray"
        label="BS"
        key="ballisticSkill"
        :value="`${character.ballisticSkill}+`"
      />
      <StatField
        color="gray"
        label="S"
        key="strength"
        :value="character.strength"
      />
      <StatField
        color="gray"
        label="T"
        key="toughness"
        :value="character.toughness"
      />
      <StatField
        color="gray"
        label="W"
        key="wounds"
        :value="character.wounds"
      />
      <StatField
        color="gray"
        label="I"
        key="initiative"
        :value="`${character.initiative}+`"
      />
      <StatField
        color="gray"
        label="A"
        key="attacks"
        :value="character.attacks"
      />
      <StatField
        color="amber"
        label="Ld"
        key="leaderShip"
        :value="`${character.leaderShip}+`"
      />
      <StatField
        color="amber"
        label="Cl"
        key="cool"
        :value="`${character.cool}+`"
      />
      <StatField
        color="amber"
        label="Wil"
        key="willpower"
        :value="`${character.willpower}+`"
      />
      <StatField
        color="amber"
        label="Int"
        key="intelligence"
        :value="`${character.intelligence}+`"
      />
      <StatField color="red" label="XP" key="xp" :value="`${character.xp}`" />
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
