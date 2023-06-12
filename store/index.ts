interface IndexState {
  pageTitle: String;
  breadcrumbs: Array<any>;
}

export const state: IndexState = {
  pageTitle: "",
  breadcrumbs: [],
};

export const mutations = {
  setPageTitle(state: IndexState, payload: String) {
    state.pageTitle = payload;
  },
};

export const getters = {
  pageTitle: (state: IndexState) => {
    return state.pageTitle;
  },
  breadcrumbs: (state: IndexState) => {
    return state.breadcrumbs;
  },
};
