<template>
  <div>
    <CallScore v-if="$store.getters['calls/callLoadFailed'] === false"></CallScore>
    <v-card v-else>
      <v-card-title> Call load failed. </v-card-title>
      <v-card-text> Something went wrong while loading rated call detail. </v-card-text>
      <v-card-actions>
        <v-btn to="/calls"  >
          Go back to calls
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import CallScore from "~/components/Call/Index.vue";
export default Vue.extend({
  name: "call-score",
  middleware: "auth",
  components: {
    CallScore,
  },
  beforeMount() {
    this.$store.commit("calls/setCallLoadFailed", false);
  },
  mounted() {
      this.$store.commit("setPageTitle", "Score Call")
  }
});
</script>
