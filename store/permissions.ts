import crudStore from "~/traits/crudStore";

const permissionStore = crudStore("Permissions");

export const state = permissionStore.state;
export const mutations = permissionStore.mutations;
export const actions = permissionStore.actions;
export const getters = permissionStore.getters;
