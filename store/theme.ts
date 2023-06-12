import { Theme } from "~/types";

export const state: Theme = {
  isDark: false,
};

export const actions = {
  changeThemeMode(app: any, payload: any) {
    app.commit("changeThemeMode", payload.isDark);
    // @ts-ignore
    const $axios = this.$axios;

    // Don't make api call if the action is for logout
    if (payload.isLogout === false) {
      $axios.put("/meta/is_dark", {
        meta_name: "is_dark",
        meta_value: new Boolean(payload.isDark).toString(),
      });
    }
  },
};

export const mutations = {
  changeThemeMode(state: Theme, payload: Boolean) {
    state.isDark = payload;
  },
};

export const getters = {
  themeBackground(state: Theme) {
    return state.isDark ? "rgb(39, 39, 39)" : "";
  },
  themeBackgroundCard(state: Theme) {
    return state.isDark ? "rgb(30 30 30)" : "";
  },
};
