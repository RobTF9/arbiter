<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Message } from "@prisma/client";
import * as z from "zod";

const props = defineProps<{ messages: Message[]; listId: string }>();

const messages = ref<Message[]>(props.messages);
const state = reactive({ message: "" });
const loading = ref(false);

const schema = z.object({
  message: z.string().min(1, "Title is required"),
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

    messages.value.push(data);
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
  <div v-for="message in messages" :key="message.id">
    <p>{{ message.message }}</p>
  </div>
  <UForm :schema="schema" :state="state" @submit="handleSubmit">
    <UFormField label="Message" name="message">
      <UInput
        v-model="state.message"
        placeholder="Type your message here..."
        class="w-full"
      />
    </UFormField>
    <UButton :loading="loading" type="submit" color="primary">Send</UButton>
  </UForm>
</template>
