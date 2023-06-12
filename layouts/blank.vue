<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
    <v-snackbar v-model="snackbarIsVisible" top>
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="handleCloseSnackbar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      snackbarIsVisible: false,
    };
  },
  computed: {
    snackbar() {
      return this.$store.getters["snackbar/snackbar"];
    },
  },
  watch: {
    ["snackbar.isVisible"]() {
      this.snackbarIsVisible = this.snackbar.isVisible;
    },
  },
  methods: {
    handleCloseSnackbar() {
      this.snackbarIsVisible = false;
      this.$store.commit("snackbar/updateSnackbar", {
        isVisible: false,
      });
    },
  },
});
</script>