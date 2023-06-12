import colors from "vuetify/es5/util/colors";

import en from "./lang/en-US";

let API_URL;

if (process.env.NODE_ENV === "development") {
  API_URL = process.env.BASE_URL_DEVELOPMENT;
} else if (process.env.NODE_ENV === "staging") {
  API_URL = process.env.BASE_URL_STAGING;
} else if (process.env.NODE_ENV === "production") {
  API_URL = process.env.BASE_URL_PRODUCTION;
}

const packageJSON = require("./package.json");

console.log(`Building for ${process.env.NODE_ENV} with base URL of ${API_URL}`);

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - Call Analyzer",
    title: "Call Analyzer",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Score calls" },
    ],
    link: [
      { rel: "icon", sizes: "any", href: "/fav-icon.png" },

      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/4.4.95/css/materialdesignicons.min.css",
      },
    ],
    script: [
      {
        type: "text/javascript",
        src: "//unpkg.com/xlsx/dist/shim.min.js",
      },
      {
        type: "text/javascript",
        src: "//unpkg.com/xlsx/dist/xlsx.full.min.js",
      },
      {
        type: "text/javascript",
        src: "//unpkg.com/blob.js@1.0.1/Blob.js",
      },
      {
        type: "text/javascript",
        src: "//unpkg.com/file-saver@1.3.3/FileSaver.js",
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~assets/main.css"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/vee-validate",
    "~/plugins/axios",
    "~/plugins/moment",
    "~/plugins/usPhone",
    // "~/plugins/recaptcha",
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/axios",
    "@nuxtjs/composition-api",
    "vue-sweetalert2/nuxt",
    "nuxt-i18n",
  ],

  i18n: {
    locales: [{ code: `en`, iso: "en-US", name: "English (US)" }],
    defaultLocale: `en`,
    vueI18n: {
      fallbackLocale: `en`,
      messages: {
        en,
      },
    },
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ["@nuxtjs/auth-next", "vue-sweetalert2/nuxt"],
  axios: {
    credentials: true,
  },
  auth: {
    // plugins custom made for CA
    plugins: [],
    // stategum
    strategies: {
      laravelSanctum: {
        provider: "laravel/sanctum",
        url: API_URL,
        user: {
          property: "data",
        },
        endpoints: {
          user: {
            url: "/user?noswal",
          },
        },
      },
    },
    // Disable redirect since we are handling redirect in the app.
    redirect: false,
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      });
    },
  },
  generate: {
    // choose to suit your project
    interval: 2000,
  },

  //env
  env: {
    baseURL: API_URL,
    buildVersion: packageJSON.version,
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },
};
