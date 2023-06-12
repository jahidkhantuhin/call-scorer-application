import { UserStore } from "~/types";
import crudStore from "~/traits/crudStore";
import { get } from "lodash";

const usersStore = crudStore("Users", {
  createPath: "register",
});

export const state: UserStore = {
  users: [],
  loading: false,
  ...usersStore.state,
};
export const mutations = {
  ...usersStore.mutations,
  setUserLoading(state: UserStore, payload: Boolean) {
    state.loading = payload;
  },
};
export const actions = {
  ...usersStore.actions,
  fetchUserMeta(app: any, component: any) {
    // @ts-ignore
    const $axios = this.$axios;

    $axios
      .get("/meta/")
      .then((resp: any) => {
        const data = get(resp, "data.data.data", null);
        if (data) {
          const theme = data.find((c: any) => c.meta_name === "is_dark");
          if (theme) {
            const themeValue = theme.meta_value === "true" ? true : false;
            app.commit("theme/changeThemeMode", themeValue, { root: true });
            (component.$vuetify.theme as any).isDark = themeValue;
          }
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  },
};
export const getters = {
  ...usersStore.getters,
  isAuthenticated(state: UserStore, getters: any, b: any) {
    return b.auth.loggedIn;
  },
  isUserLoading(state: UserStore) {
    return state.loading;
  },
  roles(state: UserStore, getters: any, b: any) {
    return b.auth && b.auth.user ? b.auth.user.role : null;
  },
  permissions(state: UserStore, getters: any, b: any) {
    return b.auth && b.auth.user ? b.auth.user.scope : null;
  },
  authenticatedUser(state: UserStore, getters: any, b: any) {
    return b.auth && b.auth.user ? b.auth.user : null;
  },
  isAllowed(state: UserStore, getters: any, b: any) {
    return (name: String) => {
      if (!name) {
        return true;
      }
      return getters && getters.permissions && getters.permissions.filter((c: String) => c === name).length > 0;
    };
  },
};
