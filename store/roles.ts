import crudStore from "~/traits/crudStore";

const rolesStore = crudStore("Roles", {
  fetchApiPropertyPath: "data.data",
});

export const state = rolesStore.state;
export const mutations = rolesStore.mutations;
export const actions = rolesStore.actions;
export const getters = rolesStore.getters;
