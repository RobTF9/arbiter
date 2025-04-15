<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Message } from "@prisma/client";
import * as z from "zod";

const props = defineProps<{ messages: Message[]; listId: string }>();

const messages = ref<Message[]>(props.messages);
const state = reactive({ message: "" });
const loading = ref(false);

const schema = z.object({
  message: z.string(),
});

type Schema = z.output<typeof schema>;

const toast = useToast();

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    const { data } = await $fetch(`/api/lists/${props.listId}`, {
      method: "POST",
      body: {
        message: event.data.message,
      },
    });

    loading.value = false;

    messages.value = [data, ...messages.value];
    state.message = "";
  } catch (error) {
    loading.value = false;
    toast.add({
      title: "Failed to create list",
      description: `${error}`,
      duration: 3000,
      color: "error",
    });
  }
}
</script>

<template>
  <UForm
    class="flex justify-end items-start gap-4 mb-6 sticky top-0 bg-(--ui-bg)"
    :schema="schema"
    :state="state"
    @submit="handleSubmit"
  >
    <UFormField name="message" class="w-full">
      <UInput
        v-model="state.message"
        placeholder="Type your message here..."
        class="w-full"
      />
    </UFormField>

    <UButton class="grow-0" :loading="loading" type="submit" color="primary"
      >Send</UButton
    >
  </UForm>
  <div v-for="message in messages" :key="message.id" class="mb-4">
    <div
      :class="`p-4 rounded text-sm   ${
        message.source === 'USER'
          ? 'ml-6 bg-gray-50 dark:bg-gray-800'
          : 'mr-6 bg-blue-50 dark:bg-blue-800'
      }`"
    >
      <div class="text-gray-500 mb-1">
        <span class="text-gray-400 text-xs mb-4">
          {{ message.source === "USER" ? "User" : "Assistant" }}</span
        >
        <p>{{ message.message }}</p>
        <span class="text-gray-400 text-xs mt-4">
          {{ new Date(message.createdAt).toLocaleString() }}</span
        >
      </div>
    </div>
  </div>
</template>
