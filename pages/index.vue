<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-card>
          <v-card-title
            >Welcome back
            {{
              authenticatedUser &&
              `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
            }}</v-card-title
          >
          <v-card-text>What do you want to do next.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-btn
          to="/calls"
          v-if="$store.getters['users/isAllowed']('view calls')"
        >
          Calls
        </v-btn>
        <v-btn
          to="/clients"
          v-if="$store.getters['users/isAllowed']('view clients')"
        >
          Clients
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  middleware: [],
  head: {
    title: "Home",
  },
  computed: {
    authenticatedUser() {
      return this.$auth.user;
    },
  },
  mounted() {
    this.$store.commit("setPageTitle", "Home")
  },
});
</script>
