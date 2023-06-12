<template>
  <v-app>
    <v-navigation-drawer
      xclass="sidebar"
      v-model="drawer"
      v-if="isAuthenticated"
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title"> Call Analyzer </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list dense nav>
          <template v-for="(item, i) in items">
            <v-list-item
              :key="i"
              :to="item.to"
              router
              exact
              v-if="!item.permission || $auth.hasScope(item.permission)"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-list>
      <div class="build-number">
        <span>Build version: {{ buildVersion }}</span>
      </div>
    </v-navigation-drawer>
    <v-app-bar fixed app class="app-navigation-bar" v-if="isAuthenticated">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title v-text="title" style="text-transform: capitialize" />
      <v-spacer />
      <v-menu
        min-width="150"
        offset-y
        :close-on-content-click="false"
        v-if="isAuthenticated"
        origin="bottom bottom"
      >
        <template v-slot:activator="{ on, attrs }">
          <div class="header-user-container ml-auto" v-bind="attrs" v-on="on">
            <v-avatar color="transparent" size="24">
              <v-icon color="grey" dark> mdi-account </v-icon>
            </v-avatar>
            <small>
              {{ authenticatedUser && authenticatedUser.first_name }}
              {{ authenticatedUser && authenticatedUser.last_name }}
            </small>
          </div>
        </template>
        <!-- <v-card> -->
        <!-- <v-card-text class="user-menu"> -->
        <v-list class="xuser-dropdown-menu">
          <v-list-item>
            <v-switch
              inset
              dense
              @click="toggleThemeMode"
              v-model="$vuetify.theme.isDark"
              :label="isDark ? `Light Mode` : `Dark Mode`"
            ></v-switch>
          </v-list-item>
          <!-- <v-list-item link 
            >
            <v-list-item-title>{{
              isDark ? "Lighten Mode" : "Dark Mode"
            }}</v-list-item-title>
            </v-list-item
          > -->
          <v-list-item link to="/profile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-progress-linear
            v-if="logoutLoading"
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="3"
            class="logout-progress-container"
          ></v-progress-linear>
        </v-list>
        <!-- </v-card-text> -->
        <!-- </v-card> -->
      </v-menu>
    </v-app-bar>
    <v-main
      :style="{ backgroundColor: $store.getters['theme/themeBackground'] }"
    >
      <div
        :style="{
          width: '95%',
          margin: 'auto',
          height: 'calc(100vh - 64px)',
          paddingTop: isAuthenticated ? '20px' : '',
          'overflow-x': 'hidden',
          'overflow-y': 'auto',
        }"
      >
        <nuxt />
      </div>
    </v-main>
    <v-snackbar v-model="snackbarIsVisible" top class="snackbar" >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="handleCloseSnackbar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="fetch-user" v-if="fetchingUser">
      <v-container class="auth-page" fill-height fluid>
        <v-row align="center" justify="center">
          <div class="inner">
            <v-progress-circular
              indeterminate
              width="2"
              color="black darken-5"
            ></v-progress-circular>
            <span>Loading...</span>
          </div>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import translations from "~/translations";
import { isAuthRoute } from "~/utils/authRoutes";

let intrvl: any;
let timeout: any;

export default Vue.extend({
  data() {
    return {
      clipped: true,
      drawer: null,
      fixed: true,
      logoutLoading: false,
      snackbarIsVisible: false,
      right: true,
      fetchingUser: true,
    };
  },
  beforeMount() {
    this.snackbarIsVisible = this.snackbar.isVisible;
  },
  watch: {
    isListeningAudio(val) {
      this.registerInterval();
    },
    isAuthenticated() {
      if (this.isAuthenticated === true) {
        this.fetchUser();
      }
    },
    ["snackbar.isVisible"]() {
      this.snackbarIsVisible = this.snackbar.isVisible;
    },
    $route() {
      // make sure on route change the user is fetched
      // this makes sure that the user is up to date
      // so if an adming changes to a Call Scorer,
      // that will be reflected on the UI.
      this.fetchUser();
    },
  },

  methods: {
    fetchUser() {
      this.$axios
        .get("/sanctum/csrf-cookie", {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        })
        .then(() => {
          this.$auth.setUserToken(true);
          setTimeout(() => {
            this.fetchingUser = false
          }, 900);
        })
    },
    async logout() {
      this.logoutLoading = true;
      await this.$auth.logout();
      this.$router.push("/login");
      this.logoutLoading = false;

      this.isDark = false;
      this.$store.dispatch("theme/changeThemeMode", {
        isDark: false,
        isLogout: true,
      });
    },
    handleCloseSnackbar() {
      this.snackbarIsVisible = false;
      this.$store.commit("snackbar/updateSnackbar", {
        isVisible: false,
      });
    },
    toggleThemeMode() {
      // @ts-ignore
      this.$store.dispatch("theme/changeThemeMode", {
        isDark: (this.$vuetify.theme as any).isDark,
        isLogout: false,
      });
    },
    sendPing() {
      if (!isAuthRoute(this.$route.fullPath)) {
        this.$axios.get("/ping");
      }
    },
    registerInterval() {
      const scheduleToSendPing = () => {
        clearTimeout(timeout);
        timeout = setTimeout(this.sendPing, 1000);
      };

      document.onload = scheduleToSendPing;
      document.onmousemove = scheduleToSendPing;
      document.onmousedown = scheduleToSendPing;
      document.ontouchstart = scheduleToSendPing;
      document.onclick = scheduleToSendPing;
      document.onkeydown = scheduleToSendPing;
      document.onscroll = scheduleToSendPing;
    },
  },
  async mounted() {
    this.registerInterval();
    this.fetchingUser = true;
    this.fetchUser();
  },
  beforeCreate() {
    clearInterval(intrvl);
  },
  destroyed() {
    clearInterval(intrvl);
  },
  computed: {
    items() {
      const isScorePage = this.$route.fullPath.includes("/call/");
      return [
        {
          icon: "mdi-home",
          title: translations.general.home,
          permission: "",
          to: "/",
        },
        {
          icon: "mdi-phone",
          title: translations.general.calls,
          permission: "view calls",
          to: isScorePage
            ? `/calls?${this.$route.fullPath.split("?")[1] || ""}`
            : "/calls/",
        },
        {
          icon: "mdi-account",
          permission: "view clients",
          title: translations.general.clients,
          to: "/clients",
        },
        {
          icon: "mdi-phone",
          permission: "score call",
          title: "Score Report",
          to: "/reports/score-report",
        },
      ];
    },
    ratingCall() {
      return this.$store.getters["calls/ratingCall"];
    },
    isListeningAudio() {
      return this.$store.getters["calls/isListeningAudio"];
    },
    buildVersion() {
      return process.env.buildVersion;
    },
    title() {
      return this.$store.getters["pageTitle"];
    },
    avatar() {
      const authUser = (this as any).authenticatedUser;
      return authUser && authUser.first_name[0] + authUser.last_name[0];
    },
    snackbar() {
      return this.$store.getters["snackbar/snackbar"];
    },
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
    authenticatedUser() {
      return this.$auth.user;
    },
    mainBackground() {
      // @ts-ignore
      return this.$vuetify.theme.isDark ? "rgb(39, 39, 39)" : "";
    },
    isDark: {
      // @ts-ignore
      get: function () {
        return (this.$vuetify.theme as any).isDark;
      },
      set: function (val) {
        (this.$vuetify.theme as any).isDark = val;
      },
    },
  },
});
</script>
<style lang="scss" scoped>
.header-user-container {
  position: relative;
  padding: 20px 3px;
}
.user-dropdown-menu {
  padding: 0;
  padding-top: 8px;
  .v-list-item {
    padding-left: 10px;
    min-height: 39px;
    cursor: pointer;
    &:hover,
    &:active {
      opacity: 0.7;
    }
  }
}
.user-menu {
  padding: 10px;
}
.sidebar {
  .v-list {
    .v-list-item {
      .v-list-item__action {
        margin-right: 10px;
      }
      &.v-list-item--active {
        background: #3ec5e5 !important;
        color: white;
      }
    }
  }
}
.logout-progress-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.fetch-user {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 99;
  background: white;
  text-align: center;
  .inner {
    > div {
      display: block;
      margin: auto;
    }
    span {
      position: relative;
      left: 7px;
    }
  }
}
.app-logo {
  height: 24px;
  width: 34px;
  margin-right: 10px;
}
.v-toolbar__title {
  text-transform: capitalize;
}
.v-navigation-drawer-header {
  padding: 19px 14px;
  padding-bottom: 0;
}
.build-number {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 14px;
  opacity: 0.8;
}
</style>

<style lang="scss">
.disabled-card {
  opacity: 0.1;
  pointer-events: none !important;
  cursor: not-allowed !important;
  transition: all 0.2s;
}
.disabled-text {
  color: #00000061 !important;
}
</style>
