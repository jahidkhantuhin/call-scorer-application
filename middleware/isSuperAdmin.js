import { SUPER_ADMIN_ROLE } from "~/utils/UserEnums";

export default ({ store, redirect }) => {
  const isAuthenticated = store.getters["users/isAuthenticated"] ? true : false;
  let isSuperAdmin = false;
  if (isAuthenticated) {
    isSuperAdmin =
      store.state.auth.user.role === SUPER_ADMIN_ROLE.toLocaleLowerCase();
  }
  if (!isSuperAdmin) redirect({ path: "/login" });
};
