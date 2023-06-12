<template>
  <span>
    <span v-if="$store.getters['users/isAllowed'](permission)">
      <slot></slot>
    </span>
    <span v-else> <span v-if="showMessage">Operation Not Allowed: {{permission}}.</span> </span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    showMessage: {
      type: Boolean,
      default: false,
    },
    permission: {
      type: String,
      default: "",
      required: true,
    },
  },
});
</script>
