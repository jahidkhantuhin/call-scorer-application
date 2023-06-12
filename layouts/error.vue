<template>
  <v-app dark>
    <div v-if="error.statusCode === 404">
      <div v-if="$route.fullPath.startsWith('/call/')">
        <h1>Call not found.</h1>
        <p>
          Go back to <NuxtLink to="/calls"> Calls</NuxtLink>.
        </p>
      </div>
      <div v-else>
        <h1>
          {{ pageNotFound }}

          <NuxtLink to="/"> Home page </NuxtLink>
        </h1>
      </div>
    </div>
    <div v-else>
      <h1>
        {{ otherError }}
      </h1>
      <NuxtLink to="/"> Home page </NuxtLink>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    };
  },
  head() {
    // @ts-ignore
    const title =
      this.error.statusCode === 404 ? (this as any).pageNotFound : (this as any).otherError;
    return {
      title,
    };
  },
});
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
