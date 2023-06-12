<template>
  <secured-component :permission="'view clients'" :show-message="true" >
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-card class="" elevation="0" width="100%">
          <v-card-text>
            <v-row>
              <v-col cols="12" class="pb-0 pt-1 d-flex">
                <h2 class="my-0 py-0">Clients</h2>
              </v-col>
            </v-row>
            <br />
            <datatable :headers="headers" :moduleName="'Clients'" height="calc(100vh - 240px)"> </datatable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </secured-component>
</template>

<script lang="ts">
import Vue from "vue";
import SecuredComponent from "~/components/SecuredComponent.vue";
export default Vue.extend({
  components: { SecuredComponent },
  middleware: "auth",
  head: {
    title: "Clients"
  },
  beforeCreate() {
    this.$store.commit('clients/resetClientsFetchRes')
  },
  mounted() {
    this.$store.dispatch("clients/fetchClients");
    this.$store.commit("setPageTitle", "Clients")
  },
  data() {
    return {
      headers: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id",
        },
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Source",
          align: "start",
          sortable: false,
          value: "source",
        },
        {
          text: "Account Id",
          align: "start",
          sortable: false,
          value: "account_id",
        },
        {
          text: "Date created",
          align: "start",
          sortable: false,
          value: "created_at",
        },
      ],
    };
  },
});
</script>

<style lang="scss">
.user {
  display: flex;
  align-items: center;
  position: relative;
  top: 4px;
  img {
    margin-right: 15px;
  }
}
</style>
