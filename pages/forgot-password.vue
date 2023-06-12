<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col md="3" sm="6" xs="12">
        <ValidationObserver ref="obs" v-slot="{ invalid, handleSubmit }">
          <v-card
            class="mt-5 pt-5 forgot-password-card text-center"
            :style="{ background: $store.getters['theme/themeBackgroundCard'] }"
            elevation="0"
            light
          >
            <v-card-text>
              <h2 class="heading mb-4 grey--text auth-form-heading">
                {{ translations.forgotPassword.heading }}
              </h2>
              <p class="px-5 grey--text auth-form-paragraph">
                {{ translations.forgotPassword.text }}
              </p>
              <v-form class="mt-5 pt-1" @submit="submit">
                <ValidationProvider
                  name="Email"
                  rules="required|email"
                  v-slot="{ errors, valid }"
                >
                  <v-text-field
                    :label="translations.general.email"
                    v-model="email"
                    :dark="$store.state.theme.isDark"
                    :success="valid"
                    :error-messages="errors"
                    required
                  ></v-text-field>
                </ValidationProvider>

                <v-btn
                  :loading="loading"
                  type="submit"
                  class="mr-4 primary mb-5 mt-2"
                  :disabled="invalid"
                  block
                  large
                >
                  {{ translations.general.reset }}
                </v-btn>
                <p class="text-right">
                  Go back to
                  <nuxt-link to="/login" class="blue--text">{{
                    translations.general.login
                  }}</nuxt-link>
                </p>
              </v-form>
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
import translations from "~/translations";
import Cookies from "js-cookie";

import { VueReCaptcha } from "vue-recaptcha-v3";

Vue.use(VueReCaptcha, {
  siteKey: "6LcELpgaAAAAADDGP5AS8HHKA3rIHT9uCSA0fzIk",
  loaderOptions: {
    autoHideBadge: true,
  },
});

const errorsForm: Array<string> = [];

import RecaptchaPowered from "~/components/RecaptchaPowered.vue";

import { defineComponent, ref, useStore } from "@nuxtjs/composition-api";
import swalMixin, { showToast } from "~/utils/swalMixin";
import showErrorOnXHRFail from "~/utils/showErrorOnXHRFail";

export default defineComponent({
  layout: "blank",
  head: {
    title: "Forgot Password",
  },
  components: {
    RecaptchaPowered,
  },
  setup(props, { parent, root }) {
    const email = ref("");
    const loading = ref(false);
    const $swal = swalMixin((parent as any).$swal as any);

    const formErrors = ref(errorsForm);

    const translate = (text: string, params?: any): string =>
      (root as any).$t(text, params);

    const submit = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      loading.value = true;
      formErrors.value = [];
      if (email.value) {
        parent?.$axios
          .get("/sanctum/csrf-cookie", {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
            withCredentials: true,
          })
          .then(async (cc) => {
            let xxsrfToken = await Cookies.get("XSRF-TOKEN");
            parent.$axios
              .post(
                "password-reset",
                {
                  email: email.value,
                },
                {
                  headers: {
                    "X-XSRF-TOKEN": xxsrfToken,
                  },
                }
              )
              .then((e) => {
                loading.value = false;
                showToast($swal, {
                  title: translate(`alert.success.pwResetEmail`) as String,
                });
              })
              .catch((e) => {
                loading.value = false;
                // showErrorOnXHRFail({
                //   $swal,
                //   error: e,
                //   translate: translate,
                //   showToast,
                //   customErrors: {
                //     code422: translate("alert.error.account.noMatch"),
                //   },
                // });
              });
          });
      }
    };

    return {
      translations,
      email,
      loading,
      submit,
    };
  },
});
</script>

<style lang="scss">
.forgot-password-card {
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
