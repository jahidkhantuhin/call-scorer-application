<template>
  <secured-component :permission="'view calls'" :show-message="true">
    <div class="calls-page" >
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card class="clients-list-sidebar" elevation="0" >
            <v-toolbar elevation="0" >
              <v-toolbar-title class="calls-heading" >
                Clients
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <div style="margin-top: -9px;padding: 5.5px 17px;" >
            <client-picker @change="handleChangeClient"  v-model="clientsFilters['client']"  ></client-picker>
            </div>
              <v-list dense nav class="pt-0 clients-list">
                <v-alert
                color="orange"
                type="success"
                v-if="clients.length === 0 && clientsLoading === false"
                >No Locations found</v-alert>
                <div
                  class="text-center search-clients-loader"
                  v-if="clientsLoading"
                >
                  <v-progress-circular
                    indeterminate
                    color="black"
                    width="2"
                  ></v-progress-circular>
                </div>
                <v-list-item
                  v-for="item in clients"
                  :key="item.id"
                  :title="item.name"
                  @click="handleClickLocation(item)"
                  link
                  :class="{
                    'clients-list-item': true,
                    'has-zero-calls': item.unrated_calls === 0,
                    active: selectedLocation && item &&  selectedLocation.id == item.id,
                  }"
                >
                <div class="scroll-into-view-top" ></div>
                  <v-list-item-content>
                    <v-list-item-title>
                      (<span
                        :class="{
                          'has-more-than-zero-calls': item.unrated_calls > 0,
                        }"
                        >{{ item.unrated_calls }}</span
                      >) {{ item.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <div class="scroll-into-view" ></div>
              </v-list>
              <v-card-text>
                <v-btn
                block
                v-if="
                  clients.length > 0 &&
                  clientsPagination &&
                  clientsPagination.total_pages !== clientsPagination.current_page
                "
                :loading="clientsLoading"
                small
                @click="handleLoadMoreClients"
                >Load More</v-btn>
              </v-card-text>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-card elevation="0" >
            <v-toolbar elevation="0">
              <v-toolbar-title v-if="selectedLocation" > Showing calls for {{selectedLocation && selectedLocation.name}} </v-toolbar-title>
              <v-toolbar-title v-else>Calls</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn :disabled="callsLoading" icon small class="mr-3" @click="loadCalls"> <v-icon>mdi-refresh</v-icon> </v-btn>
              <v-btn v-if="hasAppliedFilters && hasAppliedFiltersBefore" small @click="handleClearFilters"> Clear Filters </v-btn>
            </v-toolbar>
            <v-card-text>
              <calls-page-filters
                :selectedLocation="selectedLocation"
                @change="handleChangeFilters"
                class="filters"
              ></calls-page-filters>
              <v-data-table
              ref="table"
                class="elevation-1 data-table"
                :loading="callsLoading"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :headers="columns"
                @update:options="handleChangeOptions"
                :no-data-text="`No Calls found. Maybe a try a different search?`"
                :items="calls"
                height="calc(100vh - 340px)"
                :server-items-length="100"
                :disable-pagination="true"
                :disable-filtering="true"
                :fixed-header="true"
                :items-per-page="20"
              >
                <template v-slot:item.caller_number="props">
                  <span>
                    {{props.item.caller_number | usPhone}}
                  </span>
                </template>
                <template v-slot:item.rated="props">
                  <span>
                    <span v-if="props.item.rated">Yes</span>
                    <span v-else>No</span>
                  </span>
                </template>
                <template v-slot:item.call_start="props">
                  <span>
                    <span>
                      {{
                        $moment(
                          `${props.item.call_date} ${props.item.call_time}`
                        ).format("dddd, MMMM DD, YYYY @ hh:mm:ss A z")
                      }}
                    </span>
                  </span>
                </template>
                <template v-slot:item.rated="props">
                  <span>
                    <span v-if="props.item.rated">Yes</span>
                    <span v-else>No</span>
                  </span>
                </template>
                <template v-slot:item.call_duration="props">
                  <span><HHMMSS :time="
                    new Date(props.item.call_duration * 1000)
                      .toISOString()
                      .substr(11, 8)
                  " /></span>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" >
                        <v-btn
                          @click="
                            onScore(item)
                          "
                          
                          v-if="$store.getters['users/isAllowed']('score call')"
                          small
                          :color="item.rated ? 'info' : 'primary'"
                        >
                        <!-- :disabled="item.url === null" functionality removed to make sure the button is clickable despite no url available-->
                          {{ item.rated === true ? "Details" : "Score" }}
                        </v-btn>
                        <span v-else>Not allowed to score.</span>
                      </div>
                    </template>
                    <span v-if="item.url === null" >Call audio is not ready yet.</span>
                    <span v-else >{{  item.rated ? "Show details" : "Score call"   }}</span>
                  </v-tooltip>
                  </template>
              </v-data-table>
              <div class="footer-v2">
                <v-toolbar dense elevation="0">
                  <v-toolbar-title>
                    {{summary}}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <div class="controls">
                    <v-select
                      flat
                      elevation="0"
                      item-text="label"
                      item-value="value"
                      dense
                      solo
                      :class="{ isDark: $vuetify.theme.isDark }"
                      :dark="$vuetify.theme.isDark"
                      :items="limitItems"
                      v-model="callsFilters['limit']"
                      @change="handleChangePerPagePagination"
                      :label="`Calls per page`"
                    ></v-select>
                    <v-pagination
                      :dark="$vuetify.theme.isDark"
                      :disabled="callsLoading"
                      v-model="callsFilters['page']"
                      :total-visible="7"
                      :length="callsPagination.total_pages"
                      @input="handleChangePage"
                      :fixed-header="true"
                      class="v-pagination"
                    ></v-pagination>
                  </div>
                </v-toolbar>
                <!-- {{callsFilters}} -->
                <div class="d-flex page-input-container">
                  <span class="label">Page: </span>
                  <v-text-field
                    placeholder="Go to page"
                    type="number"
                    :max="callsPagination.total_pages"
                    :min="1"
                    @change="handleGotoPage"
                    class="page-input"
                  ></v-text-field>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </secured-component>
</template>
<script>
import {
  defineComponent,
  useStore,
  computed,
  ref,
  useRoute,
  watch,
  onMounted,
  onBeforeMount,
} from "@nuxtjs/composition-api";
import filtersVue from "~/components/filters.vue";
import CallsPageFilters from "~/components/filters.vue";
import HHMMSS from "~/components/HHMMSS.vue";
import SecuredComponentVue from "~/components/SecuredComponent.vue";
import callsHeader from "~/utils/callsHeaders";
import showErrorOnXHRFail from "~/utils/showErrorOnXHRFail";
import swalMixin, { showToast } from "~/utils/swalMixin";
import ClientPicker from "~/components/forms/ClientPicker.vue";
import { omit, pick } from "lodash";
import useClientLocations from "~/services/useClientLocations";

export default defineComponent({
  head: { 
    title: "Calls"
  },
  components: {
    SecuredComponentVue,
    CallsPageFilters,
    ClientPicker,
    HHMMSS,
  },
  setup(props, app) {
    const route = useRoute();
    const axios = app.parent.$axios;
    const store = useStore();
    const $router = app.parent.$router;
    const {locationById} = useClientLocations()
    const $route = app.parent.$route;
    const selectedLocation = ref(null);
    const selectedClient = ref(null);
    const sortBy = ref("");
    const sortDesc = ref(null);
    const clients = ref([]);
    const table = ref(null);
    const hasAppliedFiltersBefore = ref(false);
    const clientsLoading = ref(false);
    const clientsPagination = ref({});
    const columns = ref([...callsHeader]);
    const clientsFilters = ref({
      // page: 1,
      // limit: 20,
    });

    const $swal = swalMixin(app?.parent?.$swal);
    const translate = (text, params) => app.root.$t(text, params);

    const calls = ref([]);
    const callsFilters = ref({
      // page: 1,
      // limit: 20,
    });
    const callsPagination = ref({});
    const callsLoading = ref(false);

    const limitItems = ref([
      {
        value: 20,
        label: `20 per page`,
      },
      {
        value: 50,
        label: `50 per page`,
      },
      {
        value: 100,
        label: `100 per page`,
      },
      {
        value: 200,
        label: `200 per page`,
      },
      {
        value: 500,
        label: `500 per page`,
      },
    ]);

    const loadCalls = () => {
      let filters = Object.keys(callsFilters.value)
        .map((name) => {
          if (name === "clientNameSearch") {
            return null;
          }
          let value = callsFilters.value[name];
          if (callsFilters.value[name]) {
            if (name === "sort_by") {
              value = value.split("-").join(":");
            }

            return `${name}=${value}`;
          }
        })
        .filter((c) => c);

      callsLoading.value = true;
      axios
        .get(`/calls?${filters.join("&")}${clientsFilters.value.location ? `&location=${clientsFilters.value.location}` : ''}`, {
          withCredentials: true,
        })
        .then((res) => {
          const pagination = res.data?.data?.pagination;
          const result = res.data?.data?.result;
          calls.value = result;
          callsPagination.value = pagination;

          if (callsFilters.value.client && +callsFilters.value.client > 0) {
            const clientIndex = columns.value.findIndex((c) =>
              c.value.includes("location.name")
            );

            if (clientIndex === -1) {
              columns.value.splice(clientIndex, 1);
            }


          } else {
            columns.value = [...callsHeader];
          }
        })
        .finally(() => {
          callsLoading.value = false;
        });
    };

    const loadClients = (append = false) => {

      clientsLoading.value = true

      axios
        .get(
         clientsFilters.value.client ? `clients/${clientsFilters.value.client}/locations?page=${clientsPagination.value.current_page +1 || 1}` : `locations?page=${clientsPagination.value.current_page +1 || 1}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const pagination = res.data?.data?.pagination;
          const result = res.data?.data?.result;

          // if (callsFilters && callsFilters.value && callsFilters.value.location) {
          //   const f = result.find((locationItem) => locationItem.id === +callsFilters.value.location);
          //   selectedLocation.value = f;
          // }

          if (append === false) {
            clients.value = result;
          } else {
            clients.value = [...clients.value, ...result];
            const el = document.querySelector(".scroll-into-view");
            setTimeout(() => {
              el.scrollIntoView({
                behavior: "smooth",
              });
            }, 150);
          }
          clientsPagination.value = pagination;
        })
        .finally(() => {
          clientsLoading.value = false;
        });
    };

    const handleChangeFilters = (filters) => {
      hasAppliedFiltersBefore.value = true;
      callsFilters.value = {
        page: 1,
        limit: 20,
        ...filters,
      };
      $router.push({
        path: "/calls",
        query: {
          ...filters,
          page: callsFilters.value.page || 1,
        },
      });
      loadCalls();
    };

    const handleGotoPage = (e) => {
      const n = +e;
      if (
        typeof n === "number" &&
        n <= callsPagination.value.total_pages &&
        n > 0
      ) {
        callsFilters.value = {
          ...callsFilters.value,
          page: n,
        };
        $router.push({
          path: "/calls",
          query: {
            ...callsFilters.value,
            ...clientsFilters.value,
          },
        });
        loadCalls();
      }
    };

    const handleChangePerPagePagination = () => {
      hasAppliedFiltersBefore.value = true;
      callsFilters.value = {
        ...callsFilters.value,
        page: 1,
      };

      $router.push({
        path: "/calls",
        query: {
          ...callsFilters.value,
          ...clientsFilters.value,
        },
      });
      loadCalls();
    };

    const handleChangePage = () => {
      hasAppliedFilters.value = true
      $router.push({
        path: "/calls",
        query: {
          ...callsFilters.value,
          ...clientsFilters.value,
        },
      });
      loadCalls();
    };

    const handleClearFilters = () => {
      const el = document.querySelector(".scroll-into-view-top");
            setTimeout(() => {
              el.scrollIntoView({
                behavior: "smooth",
              });
            }, 0);
            setTimeout(() => {

            
      hasAppliedFiltersBefore.value = false;
      callsFilters.value = {
        page: 1,
      };
      $router.push({
        path: "/calls",
        query: null,
      });
      selectedLocation.value = null;
      sortBy.value = null;
      sortDesc.value = null;
      clientsFilters.value = {
      };
      clientsPagination.value = {}
      loadCalls();
      loadClients();
      },200)
    };

    const handleChangeOptions = (options) => {
      const sortBy = options.sortBy;
      const sortDesc = options.sortDesc;
      const column = sortBy[0];
      let order = sortDesc[0] || false;
      order = order === false ? "asc" : "desc";

      if (column && order) {
        hasAppliedFiltersBefore.value = true;
        callsFilters.value = {
          ...callsFilters.value,
          sort_by: `${column}-${order}`,
        };
        $router.push({
          path: "/calls",
          query: {
            ...callsFilters.value,
            ...clientsFilters.value,
          },
        });
        loadCalls();
      }
    };

    const loadFiltersFromUrl = () => {
      const query = route.value.query;
      query.page = +query.page || 1;
      query.limit = +query.limit || 20;
      if (query) {
        callsFilters.value = {
          ...query,
        };
        if (query.location || query.client) {
          clientsFilters.value = pick(query,['client','location'])
        }
        if (
          callsFilters.value.date_range &&
          typeof callsFilters.value.date_range === "string"
        ) {
          callsFilters.value.date_range = [
            callsFilters.value.date_range,
            callsFilters.value.date_range,
          ];
        }
        const keys = Object.keys(callsFilters.value).length;
        if (keys > 1) {
          hasAppliedFiltersBefore.value = true;
        }
        if ((selectedLocation.value && query.client === null) || !query.client) {
          selectedLocation.value = null;
        }
      }
    };

    const handleClientNameSearchChange = () => {
      hasAppliedFiltersBefore.value = true;
      clientsFilters.value = {
        ...clientsFilters.value,
        page: 1,
        limit: 20,
      };
      loadClients();
      $router.push({
        path: "/calls",
        query: {
          ...callsFilters.value,
          ...clientsFilters.value,
        },
      });
    };

    const handleClickLocation = (client) => {
      hasAppliedFiltersBefore.value = true;
      clientsFilters.value = {
        ...clientsFilters.value,
        client: selectedClient.value?.id,
        location: client.id,
      }
      callsFilters.value = {
        page: 1,
        rated_type: "unrated",
        limit: 20,
      };


      selectedLocation.value = client;
      $router.push({
        path: "/calls",
        query: {
          ...callsFilters.value,
          ...clientsFilters.value,
        },
      });
      loadCalls();
    };

    const handleLoadMoreClients = () => {
      if (
        clientsPagination.value &&
        clientsPagination.value.current_page <
          clientsPagination.value.total_pages
      ) {
        clientsFilters.value = {
          ...clientsFilters.value
        };

        loadClients(true);
      }
    };

    const hasAppliedFilters = computed(() => {
      let filters = { ...callsFilters.value };
      if (clientsFilters.value.status !== 1) {
        filters = { ...filters, clientsStatus: clientsFilters.value.status };
      }

      delete filters["page"];
      return Object.keys(filters).length > 0;
    });

    const summary = computed(() => {
      if (callsLoading.value === true) {
        return `Loading...`;
      } else if (callsPagination.value.total == 0) {
        return `No calls found`;
      } else {
        return `
          Showing ${
            callsPagination.value.current_page *
              callsPagination.value.per_page -
            callsPagination.value.per_page +
            1
          } -
          ${
            callsPagination.value.current_page * callsPagination.value.per_page
          } from ${callsPagination.value.total} calls
        `;
      }
    });

    const loadSortingIntoTable = () => {
      const val = callsFilters.value.sort_by;
      const [column, order] = val.split("-");
      if (column && order) {
        sortBy.value = column;
        sortDesc.value = order === "asc" ? false : true;
      }
    };

    const onScore = (item) => {
      const url = $router.resolve({
        path: `/call/${item.id}`,
        query: selectedLocation.value
          ? {
              ...callsFilters.value,
              clientNameSearch: selectedLocation.value.name,
              order_by: callsFilters.value.order_by
            }
          : { ...callsFilters.value,
          order_by: callsFilters.value.order_by } || {},
      });
      window.location.href = url.href;
    };

    const handleChangeClient  = (id, client) => {
      selectedClient.value = client
      clientsFilters.value = {
        ...clientsFilters.value,
        client: id
      }
      clientsPagination.value = {}
      $router.push({
        query: {
          ...clientsFilters.value,
          ...callsFilters.value
        }
      })
      loadClients();
    }

    const handleChangeClientStatus = () => {
      hasAppliedFiltersBefore.value = true;
      selectedLocation.value = null;
      callsFilters.value = {
        page: 1,
        limit: 20,
      };

      $router.push({
        path: "/calls",
        query: {
          ...callsFilters.value,
          ...clientsFilters.value,
        },
      });
      loadCalls();
      loadClients();
    };


    const fetchSelectedLocation = () => {
      const {location}  = $router.currentRoute.query;
      if (location) {
        locationById(location).then((res) => {
          selectedLocation.value = omit(res.data.data ,['campaigns'])
        })
      }
    }

    onBeforeMount(() => {
      loadFiltersFromUrl();
    });

    onMounted(() => {
      store.commit("setPageTitle", "Calls");
    loadClients();
      loadCalls();
      fetchSelectedLocation()
    });

    watch(callsFilters, () => {
      if (callsFilters.value && callsFilters.value.sort_by) {
        loadSortingIntoTable();
      }
    });

    watch(route, (a, b) => {
      if (clientsLoading.value === false && callsLoading.value === false) {
        callsFilters.value = null;
        loadFiltersFromUrl();
        setTimeout(() => {
          loadCalls();
          loadClients();
          loadSortingIntoTable();
        }, 50);
      }
    });

    return {
      // state
      clientsFilters,
      clients,
      clientsLoading,
      clientsPagination,
      calls,
      callsFilters,
      columns,
      callsLoading,
      callsPagination,
      limitItems,
      selectedLocation,
      table,
      sortBy,
      sortDesc,
      hasAppliedFiltersBefore,
      selectedClient,

      // computed
      hasAppliedFilters,
      summary,

      // Methods
      loadCalls,
      loadClients,
      handleChangeFilters,
      handleGotoPage,
      handleChangePerPagePagination,
      handleChangePage,
      handleClearFilters,
      handleChangeOptions,
      handleClientNameSearchChange,
      handleClickLocation,
      handleLoadMoreClients,
      onScore,
      handleChangeClientStatus,
      handleChangeClient
    };
  },
});
</script>

<style lang="scss">
.calls-page {
  .date-picker-calls {
    margin-top: -40px;
  }

  .clients-list-sidebar {
    .clients-list {
      overflow: auto;
      height: calc(100vh - 310px);
      .clients-list-item {
        .v-list-item__icon {
          margin-right: 8px !important;
        }
        &.active {
          background: rgb(62 197 229) !important;
          .v-list-item__title {
            color: white;
          }
        }
        &.has-zero-calls {
          .v-list-item__title {
            color: #dfdfdf;
          }
        }
        .has-more-than-zero-calls {
          color: red !important;
        }
      }
    }
  }
  .search-clients-loader {
    margin: 20px 0;
  }
  table tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05) !important;
  }
  .v-data-table .v-data-footer {
    display: none !important;
  }

  .header {
    display: flex;
    > div:nth-child(2) {
      margin-left: auto;
      .v-btn {
        margin-top: -5px;
        span i {
          font-size: 16px;
        }
      }
    }
  }
}
.clear-filters-button {
  position: relative;
  top: 0px;
  left: 10px;
}
.v-data-table .v-data-footer {
  display: none !important;
}
</style>


<style lang="scss">
.table-datatable table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
.v-data-table .v-data-footer {
  display: none !important;
}
.user {
  span {
    position: relative;
    left: -10px;
  }
}
.footer-v2 {
  margin-top: 7px;
  .v-card {
    position: relative;
    top: 9px;
  }
  .v-toolbar__content,
  .v-toolbar__extension {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .v-card,
  .v-select,
  .v-sheet {
    box-shadow: none !important;
  }
  .v-toolbar__title {
    font-size: 13px;
  }
  .controls {
    margin-left: auto;
    display: flex;
  }
  .v-select {
    position: relative;
    top: 12px;
    width: 200px;
    .v-input__slot {
      border: 1px solid #eee;
    }
    &.isDark {
      .v-input__slot {
        border: 1px solid rgb(26, 26, 26);
      }
    }
  }
  .v-pagination {
    width: inherit !important;
  }

  .page-input-container {
    margin-bottom: -5px;
    height: 43px;
    margin-top: -11px;
    .label {
      position: relative;
      top: 10px;
    }

    .page-input {
      max-width: 80px !important;
      margin-left: 30px;
      padding: 0;
    }
    .label,
    .page-input {
      font-size: 0.9em;
    }
  }
}

.filters {
  margin-top: -30px;
  margin-bottom: 7px;
}
.clients-list-sidebar {
  .v-radio {
    margin-right: 5px !important;
    .v-input--selection-controls__input {
      margin-right: 0px !important;
    }
    .v-label {
      font-size: 12px !important;
    }
    .v-icon {
      font-size: 16px !important;
      position: relative;
      top: 1px;
    }
  }
}
</style>
