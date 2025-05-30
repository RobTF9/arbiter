<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Message } from "@prisma/client";
import * as z from "zod";
import VueMarkdown from "vue-markdown-render";
import MessageSources from "./MessageSources.vue";

const props = defineProps<{ messages: Message[]; listId: string }>();
const emits = defineEmits(["clearMessages"]);

const messages = ref<Message[]>(props.messages);
const state = reactive({ message: "" });
const loading = ref(false);
const deleting = ref(false);
const polling = ref<string | null>(null);

console.log("Messages", messages.value);

const schema = z.object({
  message: z.string(),
});

type Schema = z.output<typeof schema>;

const toast = useToast();

onMounted(() => {
  if (props.messages && props.messages[0]?.status === "PENDING") {
    polling.value = props.messages[0].id;
  }
});

async function pollForMessage(id: string) {
  await refreshNuxtData();

  const data = await $fetch(`/api/message/${id}`, {
    method: "GET",
  });

  if (data?.message && data.message.status !== "PENDING") {
    polling.value = null;
    messages.value[0] = {
      ...data.message,
      createdAt: new Date(data.message.createdAt),
    };
    return;
  }

  if (data?.message && data.message.status === "PENDING") {
    messages.value =
      messages.value[0].id !== data.message.id
        ? [
            {
              ...data.message,
              createdAt: new Date(data.message.createdAt),
            },
            ...messages.value,
          ]
        : messages.value;
  }

  setTimeout(async () => {
    await pollForMessage(id);
  }, 3000);
}

watch(polling, (value) => {
  if (value) {
    pollForMessage(value);
  }
});

async function clearMessages() {
  deleting.value = true;
  await $fetch(`/api/message/${props.listId}`, {
    method: "DELETE",
  });
  emits("clearMessages");
  messages.value = [];
  toast.add({
    title: "Messages cleared",
    duration: 3000,
    color: "success",
  });
  deleting.value = false;
}

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  event.preventDefault();
  try {
    loading.value = true;
    const { data, responseId } = await $fetch(`/api/lists/${props.listId}`, {
      method: "POST",
      body: {
        message: event.data.message,
      },
    });

    loading.value = false;

    messages.value = [
      { ...data, createdAt: new Date(data.createdAt) },
      ...messages.value,
    ];
    state.message = "";
    polling.value = responseId;
    // await pollForMessage(data.id);
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
  <div>
    <UForm
      class="flex justify-end items-start gap-1 mb-6 sticky top-0 bg-(--ui-bg)"
      :schema="schema"
      :state="state"
      @submit.prevent="handleSubmit"
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
          message.status === 'ERROR'
            ? 'bg-red-50 dark:bg-red-800'
            : message.source === 'USER'
            ? 'ml-6 bg-gray-50 dark:bg-gray-800'
            : 'mr-6 bg-blue-50 dark:bg-blue-800'
        }`"
      >
        <UProgress
          v-if="message.status === 'PENDING'"
          animation="swing"
          size="xs"
          color="info"
        />
        <div v-else class="mb-1">
          <span class="text-gray-400 text-xs mb-4">
            {{ message.source === "USER" ? "User" : "Assistant" }}</span
          >
          <p v-if="message.status === 'ERROR'">
            Something went wrong while responding, your list may have been
            updated though.
          </p>
          <VueMarkdown :source="message.message" />
          <MessageSources
            v-if="message.sources && JSON.parse(message.sources).length > 0"
            :message="message"
          />
          <span class="text-gray-400 text-xs mt-4">
            {{ new Date(message.createdAt).toLocaleString() }}</span
          >
        </div>
      </div>
    </div>

    <UButton
      class="grow-0"
      :loading="deleting"
      color="error"
      @click="clearMessages"
      >Clear messages</UButton
    >
  </div>
</template>
