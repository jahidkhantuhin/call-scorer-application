<template>
  <v-row justify="center" align-content="center">
    <v-col md="4">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4" class="text-center">
              <v-avatar size="auto" max-width="100%">
                <v-img
                  src="https://randomuser.me/api/portraits/lego/6.jpg"
                  alt="Profile Photo"
                ></v-img>
              </v-avatar>
              <v-btn color="primary" class="my-2" @click="handleEditRequest">
                <v-icon left>mdi-pencil</v-icon>
                Update
              </v-btn>
            </v-col>
            <v-col md="8">
              <span class="overline">{{ user.role }}</span>
              <p class="display-1">
                {{ user.first_name }} {{ user.last_name }}
              </p>
              <p>
                <v-icon left>mdi-email</v-icon>
                {{ user.email }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-navigation-drawer v-model="dialog" width="400" absolute right temporary>
      <UserForm
        :editid="user.id"
        @done="handleDone"
        :ignore-fields="['role_id']"
        @close="dialog = false"
      ></UserForm>
    </v-navigation-drawer>
  </v-row>

  <!-- <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="8" offset-md="2">
        <v-card elevation="0" light class="mx-auto pa-5 profile-card" :style="{ background: $store.getters['theme/themeBackgroundCard'] }">
          <v-card-text class="py-0 text-center">
            <v-icon class="edit-icon" @click="handleEditRequest"> mdi-pencil </v-icon>
          </v-card-text>
          <v-card-text class="text-center user-info">
            <h2 class="mb-3 grey--text">{{ user.first_name }} {{ user.last_name }}</h2>
            <v-chip class="ma-2"> Rated Calls 5 </v-chip>
            <v-chip class="ma-2" text-color="white" color="primary"> Unated Calls 5 </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    
  </v-container> -->
</template>
<script lang="ts">
import UserForm from "~/components/forms/UserForm.vue";
import Vue from "vue";
export default Vue.extend({
  middleware: "auth",
  head: {
    title: "Profile",
  },
  data: () => ({
    dialog: false,
    tab: null,
  }),
  components: {
    UserForm,
  },
  methods: {
    handleDone() {
      this.dialog = false;
      this.$auth.fetchUser();
    },
    async handleEditRequest() {
      // @ts-ignore
      await this.$store.dispatch("users/fetchSingle", this.user.id);
      this.dialog = true;
      // @ts-ignore
      this.editid = this.user.id;
    },
  },
  computed: {
    user() {
      return this.$auth.user;
    },
  },
  mounted() {
    this.$store.commit("setPageTitle", "Profile")
  }
});
</script>

<style lang="scss" scoped>
.profile-card {
  .user-image {
    margin: 0 auto;
  }
  .user-info {
    padding: 1rem 9rem;
  }
  .edit-icon {
    position: absolute;
    right: 30px;
  }
}
</style>
