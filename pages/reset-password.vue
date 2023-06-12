<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col md="3" sm="6" xs="12">
        <ValidationObserver ref="obs" v-slot="{ invalid, handleSubmit }">
          <v-card
            class="mt-5 pt-5 forget-password-card text-center"
            :style="{ background: $store.getters['theme/themeBackgroundCard'] }"
            elevation="0"
            light
          >
            <v-card-text>
              <h2 class="heading mb-4 grey--text">Reset Password</h2>
              <p class="px-5 grey--text">
                Please choose a new password to reset your account.
              </p>
              <form class="mt-5 pt-1">
                <v-text-field
                  v-model="email"
                  type="email"
                  :label="$t('fields.email')"
                  readonly
                  disabled
                  @keypress.enter="handleSubmit(submit)"
                ></v-text-field>
                <ValidationProvider
                  name="password"
                  rules="required|strong_password|min:8"
                  v-slot="{ errors, valid }"
                >
                  <v-text-field
                    label="Password"
                    type="password"
                    ref="password"
                    v-model="password"
                    :dark="$store.state.theme.isDark"
                    :success="valid"
                    @keypress.enter="handleSubmit(submit)"
                    :error-messages="errors"
                    required
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  name="Confirm Password"
                  rules="required|strong_password|min:8|confirmed:password"
                  v-slot="{ errors, valid }"
                >
                  <v-text-field
                    label="Confirm Password"
                    type="password"
                    v-model="confirmPassword"
                    :dark="$store.state.theme.isDark"
                    :success="valid"
                    :error-messages="errors"
                    @keypress.enter="handleSubmit(submit)"
                    required
                  ></v-text-field>
                </ValidationProvider>
                <v-btn
                  :disabled="invalid === true"
                  :loading="loading"
                  class="mr-4 primary mb-5 mt-2"
                  @click="handleSubmit(submit)"
                  block
                  large
                  >Reset Password
                </v-btn>
                <p class="text-right">
                  Go back to
                  <nuxt-link to="/login" class="blue--text">Login</nuxt-link>
                </p>
              </form>
              <recaptcha-powered></recaptcha-powered>
            </v-card-text>
          </v-card>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
Vue.use(VueReCaptcha, {
  siteKey: "6LcELpgaAAAAADDGP5AS8HHKA3rIHT9uCSA0fzIk",
  loaderOptions: {
    autoHideBadge: true,
  },
});

import RecaptchaPowered from "~/components/RecaptchaPowered.vue";
import showErrorOnXHRFail from "~/utils/showErrorOnXHRFail";
import {
  computed,
  defineComponent,
  ref,
  useRoute,
  useRouter,
  useStore,
} from "@nuxtjs/composition-api";
import swalMixin, { showToast } from "~/utils/swalMixin";

export default defineComponent({
  layout: "blank",
  components: {
    RecaptchaPowered,
  },
  name: "ResetPassword",
  head: {
    title: "Reset Password",
  },
  setup(props, { root, parent }) {
    const route = useRoute();

    const password = ref("");
    const email = computed(() =>
      ((route.value.query.email || "") as string).replaceAll(" ", "+")
    );
    const confirmPassword = ref("");
    const loading = ref(false);

    const router = useRouter();

    const $swal = swalMixin((parent as any).$swal as any);

    const translate = (text: string, params?: any): string =>
      (root as any).$t(text, params);

    const $axios = root.$axios;

    const submit = () => {
      loading.value = true;

      $axios
        .post("reset", {
          password: password.value,
          password_confirmation: confirmPassword.value,
          email: email.value,
          token: router.currentRoute.query.token,
        })
        .then((resp: any) => {
          loading.value = false;
          router.push("/login");
        })
        .catch((err: any) => {
          loading.value = false;
        });
    };

    return {
      password,
      confirmPassword,
      loading,
      submit,
      email,
    };
  },
});
</script>

<style lang="scss">
.forget-password-card {
  border-radius: 5px !important;
  .heading {
    color: #000;
    font-size: 28px;
  }
  p {
    font-size: 15px;
  }
}
</style>
