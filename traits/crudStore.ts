import { get } from "lodash";
import moment from "moment";

export default function (moduleName: String, options: any = {}) {
  const defaultPagination = {
    count: null,
    current_page: 1,
    per_page: 20,
    total: null,
    total_pages: null,
  };
  const fetchApiPropertyPath =
    options.fetchApiPropertyPath || "data.data.result";
  return {
    state: {
      fetchLoading: false,
      singleFetchLoading: false,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      fetchRes: {},
      fetchSingleRes: {},
      pagination: defaultPagination,
      filters: {},
      sorting: {},
    },
    actions: {
      async [`fetch${moduleName}`]({ commit, state }: any, payload: any) {
        const $axios: any = this.$axios;
        commit(`set${moduleName}FetchLoading`, true);
        const route = `${
          payload && payload.route ? payload.route : moduleName.toLowerCase()
        }`;
        let searchString = Object.keys(state.filters)
          .map((filterName) => {
            const val = state.filters[filterName];
            let str = "";
            if (val) {
              if (filterName.includes("date")) {
                if (val && val.length === 1) {
                  const dateOne = moment(val[0])
                    .startOf("day")
                    .format("YYYY-MM-DD");
                  const dateTwo = moment(val[0])
                    .startOf("day")
                    .format("YYYY-MM-DD");
                  str = `date_range=${dateOne},${dateTwo}&`;
                } else {
                  str = `date_range=${val.join(",")}&`;
                }
              } else {
                if (filterName !== "undefined" && filterName) {
                  str = `${filterName}=${val}&`;
                }
              }
            } else {
              str = "";
            }
            return str;
          })
          .join("");

        let sortString =
          state.sorting.column && state.sorting.order
            ? `sort_by=${state.sorting.column}:${state.sorting.order}`
            : "";

        let path = `${route}?${searchString}${sortString}`;
        path = path.replace(new RegExp("&&", "g"), "&");

        $axios
          .get(path, { withCredentials: true })
          .then((result: any) => {
            commit(`set${moduleName}FetchRes`, result);
            commit(`set${moduleName}FetchLoading`, false);
          })
          .catch((err: any) => {
            commit(`set${moduleName}FetchLoading`, false);
          });
      },
      [`fetchSingle`]({ commit }: any, payload: any) {
        const $axios: any = this.$axios;
        const id = get(payload, "id", payload);
        const afterFetch = get(payload, "afterFetch", function () {});
        const onFail = get(payload, "onFail", function () {});
        return new Promise((resolve, reject) => {
          commit(`set${moduleName}SingleFetchLoading`, true);
          $axios
            .get(`/${moduleName.toLowerCase()}/${id}`, {
              withCredentials: true,
            })
            .then((res: any) => {
              commit(`set${moduleName}SingleFetchRes`, res.data);
              commit(`set${moduleName}SingleFetchLoading`, false);
              resolve(res.data);
              afterFetch(res.data);
            })
            .catch((err: any) => {
              commit(`set${moduleName}SingleFetchLoading`, false);
              onFail(err);
              reject(err);
            });
        });
      },
      [`create${moduleName}`]({ commit }: any, payload: any) {
        return new Promise(() => {
          commit(`set${moduleName}CreateLoading`, true);
          const $axios: any = this.$axios;
          const createPath =
            options.createPath || `${moduleName.toLocaleLowerCase()}/create`;
          $axios
            .post(createPath, payload.data, {
              withCredentials: true,
            })
            .then((resp: any) => {
              commit(`set${moduleName}CreateLoading`, false);
              commit(
                "snackbar/showSnackbar",
                {
                  text: `${moduleName} created Successfully`,
                },
                { root: true }
              );
              payload.onCreate && payload.onCreate();
              Promise.resolve("Created");
            })
            .catch((e: Error) => {
              const message = get(e, "response.data.message", null);
              commit(`set${moduleName}CreateLoading`, false);
              commit(
                "snackbar/showSnackbar",
                {
                  text: message
                    ? message
                    : "Something went wrong while creating " + moduleName,
                },
                { root: true }
              );
              payload.onError && payload.onError(e);
              Promise.reject(e);
            });
        });
      },
      [`update${moduleName}`]({ commit }: any, payload: any) {
        return new Promise(async () => {
          const $axios: any = this.$axios;
          commit(`set${moduleName}UpdateLoading`, true);
          try {
            await $axios.put(
              `${moduleName.toLocaleLowerCase()}/${payload.id}`,
              payload.data,
              {
                withCredentials: true,
              }
            );
            commit(`set${moduleName}UpdateLoading`, false);
            commit(
              "snackbar/showSnackbar",
              {
                text: `${moduleName} Updated Successfully`,
              },
              { root: true }
            );
            payload.onUpdate && payload.onUpdate();
            Promise.resolve("Updated");
          } catch (e) {
            Promise.reject(e);
            commit(`set${moduleName}UpdateLoading`, false);
            commit(
              "snackbar/showSnackbar",
              {
                text: "Something went wrong while updating.",
              },
              { root: true }
            );
            payload.onError && payload.onError(e);
          }
        });
      },
      [`delete${moduleName}`]({ commit }: any, payload: any) {
        const $axios: any = this.$axios;
        return new Promise(async () => {
          try {
            commit(`set${moduleName}DeleteLoading`, true);
            await $axios.delete(
              `${moduleName.toLocaleLowerCase()}/${payload.id}`,
              {
                withCredentials: true,
              }
            );
            commit(
              "snackbar/showSnackbar",
              {
                text: "Deleted Successfully",
              },
              { root: true }
            );
            commit(`set${moduleName}DeleteLoading`, false);
            Promise.resolve("Deleted");
            payload.onDelete();
          } catch (e) {
            commit(`set${moduleName}DeleteLoading`, false);
            commit(
              "snackbar/showSnackbar",
              {
                text: "Something went wrong while deleting.",
              },
              { root: true }
            );
            payload.onFail(e);
            Promise.reject(e);
          }
        });
      },
    },
    mutations: {
      [`reset${moduleName}FetchRes`](state: any, payload: any) {
        state.fetchRes = {};
        state.pagination = { ...defaultPagination };
      },
      [`set${moduleName}FetchRes`](state: any, payload: any) {
        state.fetchRes = payload;
      },
      [`remove${moduleName}Sorting`](state: any, payload: any) {
        state.sorting = {};
      },
      [`set${moduleName}SingleFetchRes`](state: any, payload: any) {
        state.fetchSingleRes = payload;
      },
      [`remove${moduleName}Filters`](state: any) {
        state.filters = {};
      },
      [`set${moduleName}Filters`](state: any, payload: any) {
        state.filters = payload;
      },
      [`update${moduleName}Filter`](state: any, payload: any) {
        state.filters[payload.name] = payload.value;
      },
      [`update${moduleName}Filters`](state: any, payload: any) {
        state.filters = payload;
      },
      [`update${moduleName}Pagination`](state: any, payload: any) {
        const pagination = { ...state.pagination };
        pagination[payload.name] = payload.value;
        state.pagination = pagination;
      },
      [`delete${moduleName}Filter`](state: any, payload: any) {
        delete state.filters[payload.name];
      },
      [`remove${moduleName}Filter`](state: any, payload: any) {
        delete state.filters[payload.name];
      },
      [`update${moduleName}Sorting`](state: any, payload: any) {
        state.sorting = {};
        state.sorting = payload;
      },
      [`set${moduleName}SingleFetchLoading`](state: any, payload: any) {
        state.singleFetchLoading = payload;
      },
      [`set${moduleName}FetchLoading`](state: any, payload: any) {
        state.fetchLoading = payload;
      },
      [`set${moduleName}CreateLoading`](state: any, payload: any) {
        state.createLoading = payload;
      },
      [`set${moduleName}UpdateLoading`](state: any, payload: any) {
        state.updateLoading = payload;
      },
      [`set${moduleName}DeleteLoading`](state: any, payload: any) {
        state.deleteLoading = payload;
      },
    },
    getters: {
      filters: (state: any) => {
        const obj = { ...state.filters };
        delete obj["page"];
        delete obj["limit"];
        return obj;
      },
      fetchLoading: (state: any) => state.fetchLoading,
      singleFetchLoading: (state: any) => state.singleFetchLoading,
      createLoading: (state: any) => state.createLoading,
      updateLoading: (state: any) => state.updateLoading,
      deleteLoading: (state: any) => state.deleteLoading,
      fetchRes: (state: any) => state.fetchRes,
      fetchSingleRes: (state: any) => state.fetchSingleRes,
      fetchResData: (state: any) => {
        if (state.fetchRes) {
          return get(state.fetchRes, fetchApiPropertyPath, []);
        } else {
          return [];
        }
      },
      fetchResPagination: (state: any) => {
        if (state.fetchRes.data) {
          return state.fetchRes.data.data.pagination;
        } else {
          return {};
        }
      },
      pagination: (state: any) => state.pagination,
    },
  };
}
