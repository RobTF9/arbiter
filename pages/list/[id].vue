<template>
  <div>
    <h1>List Item Details</h1>
    <p>You are viewing list item with ID: {{ route.params.id }}</p>
    <div class="item-details">
      <h2>Item {{ route.params.id }} Details</h2>
      <p>This is a detailed view of the selected list item.</p>
    </div>
    <div class="navigation">
      <NuxtLink to="/">Back to Home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style scoped>
h1 {
  color: #4a5568;
  margin-bottom: 1rem;
}

.item-details {
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.item-details h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.navigation {
  margin-top: 1.5rem;
}

a {
  color: #3182ce;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
