<template>
  <div>
    <ValidationObserver ref="validation" v-slot="{ invalid, handleSubmit }">
      <v-form @submit="handleFormSubmit" autocomplete="off">
        <v-card-title>
          <span class="headline">{{ formHeading }}</span>
        </v-card-title>
        <v-card-text>
          <div class="body">
            <v-container>
              <v-row v-for="(fields, index1) in userFormFields" v-bind:key="index1">
                <v-col v-for="field in fields" v-bind:key="field.key" cols="12">
                  <span v-if="ignoreFields.includes(field.key) === false">
                    <span v-if="field.type == 'string' || field.type == 'password' || field.type === 'number'">
                      <ValidationProvider
                        :name="field.key"
                        :rules="field.rules"
                        v-slot="{ errors, valid }"
                        :hidden="field.key === 'pay_rate' && formData['role_id'] != 4"
                      >
                        <v-text-field
                          :type="field.type === 'password' ? 'password' : field.type"
                          :ref="field.key"
                          :error-messages="errors"
                          :success="valid"
                          :dark="$store.state.theme.isDark"
                          :label="field.title"
                          v-model="formData[field.key]"
                          autocomplete="off"
                        ></v-text-field>
                      </ValidationProvider>
                    </span>
                    <span v-else-if="field.type === 'switch'">
                      <v-switch v-model="formData[field.key]" :label="field.title"></v-switch>
                    </span>
                    <span v-else-if="field.type === 'radio'">
                      <h4>{{ field.title }}</h4>
                      <ValidationProvider :name="field.key" :rules="field.rules" v-slot="{ errors, valid }">
                        <v-radio-group :error-messages="errors" :success="valid" class="radio-group" v-model="formData[field.key]">
                          <v-radio :value="n.id" v-for="n in field.options" :key="n.id" :label="n.name"></v-radio>
                        </v-radio-group>
                      </ValidationProvider>
                    </span>
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" color="darken-1" text @click="$emit('close')"> Cancel </v-btn>
          <v-btn :loading="loading" :disabled="invalid" color="primary" type="submit" @click="handleSubmit(() => {})">
            {{ editid ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </ValidationObserver>
    <!-- user is editing password dialog -->
    <v-dialog v-model="passwordEditConfirmDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline"> You are changing a password </v-card-title>
        <v-card-text>You are changing a password for other user.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="passwordEditConfirmDialog = false"> Cancel </v-btn>
          <v-btn color="green darken-1" text @click="updateUserGo"> Go ahead </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- user is editing password dialog -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { SUPER_ADMIN_ROLE } from "~/utils/UserEnums";

export default Vue.extend({
  name: "UserForm",
  mounted() {
    const validation: any = this.$refs.validation;
    validation.reset();
    const res = this.$store.getters["users/fetchSingleRes"];
    if (this.editid && res && res.data) {
      const data = { ...res.data };
      if (data) {
        delete data["permissions"];
        delete data["role"];
        this.formData = data;
      }
    } else {
      // @ts-ignore;
      this.formData = {};
    }
  },
  methods: {
    async updateUserGo() {
      this.passwordEditConfirmDialog = false;
      const validation: any = this.$refs.validation;
      const _this = this;
      await this.$store.dispatch("users/updateUsers", {
        data: this.formData,
        id: this.editid,
        onUpdate() {
          validation.reset();
          // @ts-ignore
          _this.formData = {};
          _this.$emit("done");
        },
      });
    },
    async handleFormSubmit(e: Event) {
      e.preventDefault();
      const _this = this;

      const validation: any = this.$refs.validation;
      let a = await validation.validate();
      if (a) {
        if (this.editid) {
          if (this.$route.path.includes("profile") === false && this.$auth.user?.role === SUPER_ADMIN_ROLE && this.formData?.password) {
            this.passwordEditConfirmDialog = true;
            return;
          }
          this.updateUserGo();
        } else {
          await this.$store.dispatch("users/createUsers", {
            data: this.formData,
            onCreate() {
              validation.reset();
              // @ts-ignore
              _this.formData = {};
              _this.$emit("done");
            },
          });
        }
      } else {
        this.$store.commit("snackbar/showSnackbar", {
          text: "Errors in your form.",
        });
      }
    },
  },
  props: {
    ignoreFields: {
      type: Array,
      default: [],
    },
    editid: {
      type: Number,
      default: null,
    },
  },
  computed: {
    loading() {
      if (this.isEditing) {
        return this.$store.getters["users/updateLoading"];
      } else {
        return this.$store.getters["users/createLoading"];
      }
    },
    isEditing() {
      return this.editid && this.editid > 0;
    },
    formHeading() {
      return this.editid && this.editid > 0 ? `Update User Profile` : `Add a new user`;
    },
    userFormFields() {
      const options = this.$store.getters[`roles/fetchResData`] || [];
      const restrictedOptions = options.filter((c: any) => {
        return c.name.toLowerCase() !== SUPER_ADMIN_ROLE;
      });

      let passwordField = [
        {
          key: "password",
          showonEdit: false,
          title: "Password",
          type: "password",
          // @ts-ignore
          rules: `${!this.isEditing || this.formData["old_password"] ? "required|" : ""}min:5|strong_password`,
        },
        {
          key: "password_confirmation",
          showonEdit: false,
          title: "Confirm Password",
          type: "password",
          // @ts-ignore
          rules: `${!this.isEditing || this.formData["password"] ? "required|" : ""}min:5|strong_password|confirmed:password`,
        },
      ];

      if (this.isEditing) {
        passwordField = [
          {
            key: "old_password",
            showonEdit: false,
            title: "Old Password",
            type: "password",
            // @ts-ignore
            rules: `${!this.isEditing ? "required|" : ""}min:5`,
          },
          ...passwordField,
        ];
      }

      // @ts-ignore
      let password = !this.isEditing ? passwordField : [];
      let payRateField: any = {
        key: "pay_rate",
        showonEdit: false,
        rules: "min_value:00.01|max_value:99.99",
        title: "Pay Rate",
        type: "number",
      };

      if (this.isEditing && this.$route.name?.includes("profile")) {
        password = passwordField;
      }

      if (this.isEditing && this.$auth.user?.role === SUPER_ADMIN_ROLE) {
        password = passwordField;
      }

      if (this.$route.name?.includes("profile")) {
        payRateField = {};
      }
      

      return [
        [
          {
            key: "first_name",
            showonEdit: false,
            title: "First Name",
            type: "string",
            rules: "required",
          },
          {
            key: "last_name",
            showonEdit: false,
            title: "Last Name",
            type: "string",
            rules: "required",
          },
        ],
        [
          {
            key: "email",
            showonEdit: false,
            title: "Email",
            type: "string",
            rules: "required|email",
          },
        ],
        password,
        [
          // {
          //   key: "job_title",
          //   showonEdit: false,
          //   title: "Job Title",
          //   type: "string",
          // },
          payRateField,
          // {
          //   key: "organisation",
          //   showonEdit: false,
          //   title: "Organisation",
          //   type: "string",
          // },
          // {
          //   key: "address",
          //   showonEdit: false,
          //   title: "Address",
          //   type: "string",
          // },
          // {
          //   key: "phone_number",
          //   showonEdit: false,
          //   title: "Phone",
          //   type: "string",
          // },
        ],
        [
          {
            key: "role_id",
            showonEdit: false,
            title: "Role",
            type: "radio",
            // @ts-ignore
            rules: this.isEditing ? "" : "required",
            options: restrictedOptions,
          },
        ],
      ];
    },
  },

  data() {
    return {
      formData: {
        password: "",
      },
      passwordEditConfirmDialog: false,
    };
  },
});
</script>

<style lang="scss">
// .body {
//   height: 400px;
//   overflow: auto;
// }
.v-input.radio-group .v-label {
  text-transform: capitalize;
}
</style>
