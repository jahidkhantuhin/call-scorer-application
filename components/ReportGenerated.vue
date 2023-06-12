<template>
  <v-alert prominent type="success">
    <v-row align="center">
      <v-col class="grow"> Report generated successfully. </v-col>
      <v-col class="shrink">
        <v-btn
          icon
          color="white"
          title="Download Report"
          :loading="loading"
          @click="$emit('download')"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    date: String,
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    return {}
  },
})
</script>
