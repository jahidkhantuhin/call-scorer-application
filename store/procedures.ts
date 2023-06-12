import crudStore from "~/traits/crudStore";

const proceduresStore = crudStore("Procedures", {
  fetchApiPropertyPath: "data.data",
});

export const state = proceduresStore.state;
export const mutations = proceduresStore.mutations;
export const actions = proceduresStore.actions;
export const getters = proceduresStore.getters;
