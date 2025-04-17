<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
const { data, error, refresh } = await useFetch("/api/lists");

const lists = ref(data.value?.lists || []);
const loading = ref(false);
const open = ref(false);
const form = reactive({
  title: "",
  description: "",
  gang: "",
  credits: 1000,
});

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  gang: z.string().min(1, "Gang is required"),
  description: z.string(),
  credits: z.number(),
});

const toast = useToast();

type Schema = z.output<typeof schema>;

async function handleFormSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    await $fetch("/api/lists", {
      method: "POST",
      body: {
        title: event.data.title,
        description: event.data.description,
        gang: event.data.gang,
        credits: event.data.credits,
      },
    });

    await refresh();

    lists.value = data.value?.lists || [];
    form.title = "";
    form.description = "";

    loading.value = false;
    open.value = false;
    toast.add({
      title: "List created",
      duration: 3000,
      color: "success",
    });
  } catch (error) {
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
  <main>
    <div v-if="error">
      {{ error.message }}
    </div>
    <UContainer v-else class="space-y-6">
      <header class="flex items-center justify-between">
        <h1 class="font-bold text-2xl">Lists</h1>
        <UModal v-model:open="open" title="Create new list">
          <UButton label="Create new list" />
          <template #body>
            <UForm
              :schema="schema"
              :state="form"
              class="space-y-4 w-full"
              @submit="handleFormSubmit"
            >
              <UFormField label="Title" name="title">
                <UInput v-model="form.title" autofocus class="w-full" />
              </UFormField>
              <UFormField label="Gang" name="gang">
                <UInput v-model="form.gang" class="w-full" />
              </UFormField>
              <UFormField label="Credits" name="credits">
                <UInput v-model="form.credits" type="number" class="w-full" />
              </UFormField>
              <UFormField label="Description" name="description">
                <UTextarea v-model="form.description" class="w-full" />
              </UFormField>
              <UButton :loading="loading" type="submit">Submit</UButton>
            </UForm>
          </template>
        </UModal>
      </header>
      <div v-if="lists.length === 0" class="w-full">
        You have no lists yet. Create one to get started.
      </div>
      <ul v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <UCard v-for="list in lists" :key="list.id">
          <header class="mb-4 flex gap-2 items-center">
            <h2 class="font-bold">{{ list.title }}</h2>
            <UBadge color="neutral" variant="subtle">{{ list.gang }}</UBadge>
            <UBadge class="ml-auto rounded-full" variant="subtle"
              >{{ list.rating }} rating</UBadge
            >
          </header>
          <USeparator class="mb-4" />
          <p class="text-gray-400">{{ list.description }}</p>
          <ULink
            class="block mt-4 text-blue-500 underline"
            :href="`/${list.id}`"
            >View list</ULink
          >
        </UCard>
      </ul>
    </UContainer>
  </main>
</template>
