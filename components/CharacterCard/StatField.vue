<script setup lang="ts">
const props = defineProps<{
  label: string;
  key: string;
  value: string | number;
  color: string;
  suffix?: string;
  prefix?: string;
}>();

const emit = defineEmits<{
  "update:value": [value: number];
}>();

const temp = ref(props.value);
const isEditing = ref(false);

const handleBlur = () => {
  if (typeof temp.value === "string") {
    const parsed = parseInt(
      temp.value.replaceAll(props.prefix || props.suffix || "", ""),
      10
    );
    emit("update:value", parsed);
  } else {
    emit("update:value", temp.value);
  }

  isEditing.value = false;
};

const handleFocus = (event: Event) => {
  isEditing.value = true;
  nextTick(() => {
    (event.target as HTMLInputElement).select();
  });
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    (event.target as HTMLInputElement).blur();
  }
};
</script>

<template>
  <div
    :class="`flex flex-col items-center justify-center bg-${color}-50 dark:bg-${color}-800 p-2 rounded`"
  >
    <div :class="`text-xs text-${color}-500 dark:text-${color}-400`">
      {{ label }}
    </div>
    <UInput
      variant="none"
      v-model="temp"
      :class="`text-lg font-bold text-${color}-700 dark:text-${color}-300 w-16 text-center bg-transparent focus:outline-none`"
      :ui="{
        base: 'text-center',
      }"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeydown"
    />
  </div>
</template>
