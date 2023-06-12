import { SUPER_ADMIN_ROLE, ADMIN_ROLE } from "~/utils/UserEnums";

export default ({ store, redirect }) => {
  const isAuthenticated = store.getters["users/isAuthenticated"] ? true : false;
  let isAdmin = false;

  if (isAuthenticated) {
    isAdmin =
      store.state.auth.user.role === SUPER_ADMIN_ROLE.toLocaleLowerCase() ||
      store.state.auth.user.role === ADMIN_ROLE.toLocaleLowerCase();
  }

  if (!isAdmin) redirect({ path: "/login" });
};
