import { Snackbar } from "~/types";

let timeout: any;

export const state = {
  isVisible: false,
  text: "",
  multiLine: false,
  outlined: false,
  width: "200px",
  shaped: false,
  tile: false,
};

export const mutations = {
  updateSnackbar(state: any, obj: any) {
    const keys = Object.keys(obj);
    keys.forEach((element) => {
      state[element] = obj[element];
    });
  },
  showSnackbar(state: Snackbar, obj: Snackbar) {
    clearTimeout(timeout);
    let _this: any = this;
    state.isVisible = true;
    state.text = obj.text;
    timeout = setTimeout(() => {
      _this.commit("snackbar/removeSnackbar");
    }, obj.timeout || 5000);
  },
  removeSnackbar(state: Snackbar) {
    clearTimeout(timeout);
    state.isVisible = false;
  },
};

export const getters = {
  snackbar(state: Snackbar) {
    return state;
  },
};
