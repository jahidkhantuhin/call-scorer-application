import crudStore from "~/traits/crudStore";

const clientStore = crudStore("Clients");

export const state = clientStore.state;
export const mutations = clientStore.mutations;
export const actions = clientStore.actions;
export const getters = clientStore.getters;
