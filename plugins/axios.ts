import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Plugin } from "@nuxt/types";
import swalMixin, { showToast } from "~/utils/swalMixin";
import showErrorOnXHRFail from "~/utils/showErrorOnXHRFail";
import { isAuthRoute } from "~/utils/authRoutes";

const fn: Plugin = function (root: any, inject: Function) {
  const $axios: NuxtAxiosInstance = root.$axios;
  const router = root.app.router;
  const route = root.route;

  const $swal = swalMixin(root.$swal as any);

  const translate = (text: string, params?: any): string =>
    root.i18n.t(text, params);

  $axios.defaults.baseURL = process.env.baseURL;
  $axios.defaults.withCredentials = true;

  $axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      showErrorOnXHRFail({
        $swal,
        error: error,
        translate: translate,
        showToast,
        route
      });
      if (error.response) {
        const { response } = error;
        const status = response.status;

        if (status === 401 && !isAuthRoute(window.location.pathname)) {
          router.push({
            path: "/login",
            query: {
              redirect: route.fullPath,
            },
          });
        }
      }

      return Promise.reject(error);
    }
  );

  inject("axios", $axios);
};

export default fn;
