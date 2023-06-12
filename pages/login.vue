<template>
  <v-container class="auth-page login-page" fill-height fluid>
    <v-row align="center" justify="center">
      <v-col md="7" sm="7" xs="12" lg="3">
        <v-expand-transition>
          <v-card class="text-center" v-if="fetchingUser">
            <v-card-text>
              <v-progress-circular :size="50" color="primary" indeterminate>
              </v-progress-circular>
            </v-card-text>
            <v-card-text class="text-center">Checking User info</v-card-text>
          </v-card>
        </v-expand-transition>
        <v-expand-transition>
          <v-card
            elevation="0"
            v-if="showForm"
            class="mt-5 login-card"
            :style="{ background: $store.getters['theme/themeBackgroundCard'] }"
            light
          >
            <ValidationObserver ref="obs" v-slot="{ invalid }">
              <v-card-text class="text-center mb-5">
                <h1 class="welcome-heading">Welcome to WM4D's</h1>
                <img
                  src="~static/login-header.png"
                  class="login-header-image"
                  alt=""
                />
                <h2 class="login-heading">{{ translations.login.heading }}</h2>

                <v-form @submit="submit">
                  <ValidationProvider
                    name="Email"
                    rules="required|email"
                    v-slot="{ errors, valid }"
                  >
                    <v-text-field
                      :label="translations.general.email"
                      v-model="email"
                      :error-messages="errors"
                      :success="valid"
                      name="email"
                      :dark="$store.state.theme.isDark"
                      required
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider
                    name="Password"
                    rules="required"
                    v-slot="{ errors, valid }"
                  >
                    <v-text-field
                      :label="translations.general.password"
                      v-model="password"
                      :error-messages="[...errors, ...formErrors]"
                      :success="valid"
                      :dark="$store.state.theme.isDark"
                      type="password"
                      name="password"
                      required
                    ></v-text-field>
                  </ValidationProvider>

                  <v-btn
                    :loading="loading"
                    type="submit"
                    :disabled="invalid"
                    class="mr-4 primary mb-5 mt-5"
                    block
                    large
                  >
                    {{ translations.login.heading }}
                  </v-btn>
                  <p class="text-right">
                    <nuxt-link to="/forgot-password" class="blue--text">{{
                      translations.forgotPassword.heading
                    }}</nuxt-link>
                  </p>
                </v-form>
              </v-card-text>
              <recaptcha-powered></recaptcha-powered>
            </ValidationObserver>
          </v-card>
        </v-expand-transition>
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
import swalMixin, { showToast } from "~/utils/swalMixin";

import translations from "~/translations";
import deleteAllCookies from "~/utils/deleteAllCookies";

import RecaptchaPowered from "~/components/RecaptchaPowered.vue";
import {
  defineComponent,
  ref,
  useRoute,
  useRouter,
  useStore,
  onMounted,
} from "@nuxtjs/composition-api";
import showErrorOnXHRFail from "~/utils/showErrorOnXHRFail";

const errors: Array<string> = [];

export default defineComponent({
  middleware: ["redirectToHomeIfAlreadyLoggedIn"],
  layout: "blank",
  components: {
    RecaptchaPowered,
  },
  setup(props, { parent, root }) {
    const $auth = parent?.$auth;
    const $axios = parent?.$axios;
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const formErrors = ref(errors);
    const loading = ref(false);
    const showForm = ref(false);
    const fetchingUser = ref(true);
    const $swal = swalMixin((parent as any).$swal as any);

    // PW reset modal
    const showPWReset = ref(false);

    // we'll use this to i18n text
    // useContext() doesn't work here for some reason
    const translate = (text: string, params?: any): string =>
      (root as any).$t(text, params);

    const submit = async (e: Event) => {
      e.preventDefault();

      // handle loading and form errors
      loading.value = true;
      formErrors.value = [];

      // await $auth?.logout();
      deleteAllCookies();
      localStorage.clear();

      $auth
        ?.loginWith("laravelSanctum", {
          data: {
            email: email.value,
            password: password.value,
          },
        })
        .then((response: any) => {
          $auth.setUser(response.data.data);

          router.push((route.value.query as any).redirect || "/");

          loading.value = false;
          showToast($swal, {
            title: translate("alert.success.login"),
          });
        })
        .catch((e) => {
          loading.value = false;
        });
    };

    onMounted(async () => {
      await $axios
        ?.get('/sanctum/csrf-cookie', {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        })
        .then(() => {
          $auth
            ?.setUserToken(true)
            .then((resp) => {
              if (resp) {
                router.push((route.value.query as any).redirect || "/");
              }
            })
            .finally(() => {
              fetchingUser.value = false
              showForm.value = true
            })
        })
    });

    return {
      translations,
      email,
      password,
      formErrors,
      loading,
      submit,
      fetchingUser,
      showForm,
    };
  },
});
</script>

<style lang="scss" scoped src="~/styles/auth.page.scss"></style>

<style lang="scss">
.login-page {
  .login-card {
    padding: 26px 12px;
  }
  .welcome-heading {
    font-family: Futura Bk BT;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
  }
  .login-heading {
    font-family: Futura Bk BT;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 29px;
  }
  .login-header-image {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
