<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the home page of our Nuxt application.</p>
    <div>
      <NuxtLink to="/list/1">View List Item 1</NuxtLink>
    </div>
    <div>
      <NuxtLink to="/list/2">View List Item 2</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Home page component logic can go here
</script>

<style scoped>
h1 {
  color: #4a5568;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1.5rem;
}

div {
  margin-bottom: 0.5rem;
}

a {
  color: #3182ce;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
