<template>
  <div class="table-datatable">
    <v-data-table
      class="elevation-1 data-table"
      :loading="$store.getters[`${moduleNameLowerCase}/fetchLoading`]"
      :headers="headers"
      @update:options="handleChangeOptions"
      :no-data-text="`No ${moduleName}. Maybe a try a different search?`"
      :items="list"
      :height="height"
      :server-items-length="
        $store.getters[`${moduleNameLowerCase}/fetchResPagination`][
          'total_pages'
        ] || 5
      "
      :disable-pagination="true"
      :disable-filtering="true"
      :fixed-header="true"
      :items-per-page="20"
    >
      <!-- Calls -->
      <template v-slot:item.call_start="props" v-if="moduleName == 'Calls'">
        <span>
          <span>
            {{
              $moment(`${props.item.call_date} ${props.item.call_time}`).format(
                "MMM Do YYYY, h:mm:ss a"
              )
            }}
          </span>
        </span>
      </template>
      <template v-slot:item.rated="props" v-if="moduleName == 'Calls'">
        <span>
          <span v-if="props.item.rated">Yes</span>
          <span v-else>No</span>
        </span>
      </template>
      <template v-slot:item.call_duration="props" v-if="moduleName == 'Calls'">
        <span>{{
          new Date(props.item.call_duration * 1000).toISOString().substr(11, 8)
        }}</span>
      </template>
      <!-- Users Columns -->
      <template v-slot:item.created_at="props">
        <span> {{ $moment(props.item.created_at).fromNow() }} </span>
      </template>
      <template v-slot:item.name="props" v-if="moduleName == 'Users'">
        <div class="user">
          <span>
            {{ props.item.first_name }}
            {{ props.item.last_name }}
          </span>
        </div>
      </template>
      <template v-slot:item.email="props" v-if="moduleName == 'Users'">
        <div>{{ props.item.email }}</div>
      </template>
      <template v-slot:item.role_name="props" v-if="moduleName == 'Users'">
        <span style="text-transform: capitalize">{{ props.item.role }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-menu offset-y v-if="moduleName == 'Users'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small color="primary" dark v-bind="attrs" v-on="on">
              Actions
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-if="$store.getters['users/isAllowed']('update user')"
              @click="$emit('edit', item.id)"
            >
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="$store.getters['users/isAllowed']('delete user')"
              @click="
                deleteConfirm = true;
                deleteId = item.id;
              "
            >
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <span v-if="moduleName === 'Calls'">
          <v-btn
            @click="
              $router.push({
                path: `/call/${item.id}`,
                query: $route.query || {},
              })
            "
            v-if="$store.getters['users/isAllowed']('score call')"
            small
            :color="item.rated ? 'info' : 'primary'"
          >
            {{ item.rated === true ? "Details" : "Score" }}
          </v-btn>
          <span v-else>Not allowed to score.</span>
        </span>
      </template>
      <!-- Users Columns -->
    </v-data-table>
    <div class="footer-v2">
      <v-card>
        <v-toolbar dense>
          <v-toolbar-title
            v-if="
              $store.getters[`${moduleNameLowerCase}/fetchResPagination`][
                'total'
              ] &&
              $store.getters[`${moduleNameLowerCase}/fetchResPagination`][
                'total'
              ] > 0
            "
          >
            Showing {{ page * perpage - perpage + 1 }} -
            {{ page * perpage }} from
            {{
              $store.getters[`${moduleNameLowerCase}/fetchResPagination`][
                "total"
              ]
            }}
            {{ moduleName }}</v-toolbar-title
          >
          <!-- <v-spacer></v-spacer> -->
          <div class="controls">
            <v-select
              flat
              elevation="0"
              item-text="label"
              item-value="value"
              dense
              solo
              :disabled="$store.getters[`${moduleNameLowerCase}/fetchLoading`]"
              :class="{ isDark: $vuetify.theme.isDark }"
              @change="handleChangePerPagePagination"
              v-model="perpage"
              :dark="$vuetify.theme.isDark"
              :items="limitItems"
              :label="`${moduleName} per page`"
            ></v-select>
            <v-pagination
              :disabled="$store.getters[`${moduleNameLowerCase}/fetchLoading`]"
              :total-visible="7"
              v-model="page"
              :dark="$vuetify.theme.isDark"
              @input="handleChangePage"
              :disable-pagination="true"
              :disable-filtering="true"
              :fixed-header="true"
              class="v-pagination"
              :length="
                $store.getters[`${moduleNameLowerCase}/fetchResPagination`][
                  'total_pages'
                ] || 5
              "
            ></v-pagination>
          </div>
        </v-toolbar>
        <div class="d-flex page-input-container" v-if="moduleName === 'Calls'">
          <span class="label">Page: </span>
          <v-text-field
            @change="handleGotoPage"
            placeholder="Go to page"
            type="number"
            v-model="inputPage"
            :max="storePagination.total_pages"
            :min="1"
            class="page-input"
          ></v-text-field>
        </div>
      </v-card>
    </div>
    <v-dialog persistent v-model="deleteConfirm" max-width="290">
      <v-card>
        <v-card-title class="headline"> Delete? </v-card-title>
        <v-card-text>
          Are you want to delete this {{ moduleName }}.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="$store.getters['users/deleteLoading']"
            color="darken-1"
            text
            @click="deleteConfirm = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red white"
            :loading="$store.getters['users/deleteLoading']"
            @click="handleDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import loadFiltersFromUrl from "~/utils/loadFiltersFromUrl";
export default Vue.extend({
  props: {
    height: {
      type: String,
      default: "100%",
    },
    headers: {
      type: Array,
      required: true,
      default: [],
    },
    moduleName: {
      type: String,
      required: true,
      default: "",
    },
  },
  watch: {
    storePagination() {
      // if (this.storePagination.current_page) {
      //   this.page = this.storePagination.current_page
      // }
      // if (this.storePagination.per_page) {
      //   this.perpage = this.storePagination.per_page
      // }
    },
    filtersStore() {
      (this as any).$store.commit(
        `${(this as any).moduleNameLowerCase}/update${
          (this as any).moduleName
        }Pagination`,
        {
          name: "current_page",
          // @ts-ignore
          value: 1,
        }
      );
    },
    $route() {
      this.fetchList();
      this.loadPaginationFromUrl();
    },
  },
  computed: {
    storePagination() {
      // @ts-ignore
      return (this as any).$store.getters[
        `${(this as any).moduleNameLowerCase}/pagination`
      ];
    },
    filtersStore() {
      // @ts-ignore
      return (this as any).$store.getters[
        `${(this as any).moduleNameLowerCase}/filters`
      ];
    },
    limitItems() {
      // "20", "50", "100", "200", "500"
      return [
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
      ];
    },
    moduleNameLowerCase() {
      return (this as any).moduleName.toLowerCase();
    },
    list() {
      // @ts-ignore
      return (this as any).$store.getters[
        `${(this as any).moduleNameLowerCase}/fetchResData`
      ];
    },
  },
  methods: {
    loadPaginationFromUrl() {
      const { pagination } = loadFiltersFromUrl({
        $route: this.$route,
      });

      if (pagination.page) {
        this.page = +pagination.page;
      }
      if (pagination.limit) {
        this.perpage = +pagination.limit;
      }
    },
    handleGotoPage(e: KeyboardEvent) {
      const val = this.inputPage;
      if (val && typeof +val === "number") {
        if (val > 0 && val <= this.storePagination.total_pages) {
          this.page = +val;
          this.$store.commit(
            `${this.moduleNameLowerCase}/update${this.moduleName}Pagination`,
            {
              name: "current_page",
              value: val,
            }
          );

          if ((this as any).moduleName === "Calls") {
            this.$router.push({
              query: {
                ...this.$route.query,
                page: val,
              },
            });
          }

          (this as any).$store.dispatch(
            `${(this as any).moduleNameLowerCase}/fetch${
              (this as any).moduleName
            }`
          );

          (this as any).inputPage = "";
        }
      }
    },
    handleChangePage() {
      // @ts-ignore
      (this as any).$store.commit(
        `${(this as any).moduleNameLowerCase}/update${
          (this as any).moduleName
        }Pagination`,
        {
          name: "current_page",
          // @ts-ignore
          value: (this as any).page,
        }
      );
      // @ts-ignore
      (this as any).fetchList();
      if ((this as any).moduleName === "Calls") {
        this.$router.push({
          query: {
            ...this.$route.query,
            page: (this as any).page,
          },
        });
      }
    },
    handleChangePerPagePagination() {
      // @ts-ignore
      (this as any).page = 1;
      // @ts-ignore
      (this as any).$store.commit(
        `${(this as any).moduleNameLowerCase}/update${
          (this as any).moduleName
        }Pagination`,
        {
          name: "current_page",
          // @ts-ignore
          value: 1,
        }
      );
      // @ts-ignore
      (this as any).$store.commit(
        `${(this as any).moduleNameLowerCase}/update${
          (this as any).moduleName
        }Pagination`,
        {
          name: "per_page",
          // @ts-ignore
          value: (this as any).perpage,
        }
      );
      // @ts-ignore
      (this as any).fetchList();

      if ((this as any).moduleName === "Calls") {
        (this as any).$router.replace({
          query: {
            ...this.$route.query,
            perpage: (this as any).perpage,
          },
        });
      }
    },
    async handleDelete() {
      const _this: any = this;
      // @ts-ignore
      (_this as any).$store.dispatch(
        `${(this as any).moduleNameLowerCase}/delete${
          (this as any).moduleName
        }`,
        {
          id: (_this as any).deleteId,
          onDelete: () => {
            // @ts-ignore
            (_this as any).deleteConfirm = false;
            // @ts-ignore
            (_this as any).fetchList();
          },
          onFail: () => {
            // @ts-ignore
            (_this as any).deleteConfirm = false;
          },
        }
      );
    },
    handleChangeOptions(options: any) {
      const sortBy: Array<String> = options.sortBy;
      const sortDesc: Array<Boolean> = options.sortDesc;
      const column = sortBy[0];
      let order: any = sortDesc[0] || false;
      order = order === false ? "asc" : "desc";
      if (column) {
        // @ts-ignore
        (this as any).$store.commit(
          `${(this as any).moduleNameLowerCase}/update${
            (this as any).moduleName
          }Sorting`,
          {
            column,
            order,
          }
        );
        // @ts-ignore
        (this as any).fetchList();
      }
    },
    fetchList() {
      // @ts-ignore
      (this as any).$store.dispatch(
        `${(this as any).moduleNameLowerCase}/fetch${(this as any).moduleName}`
      );
    },
  },
  data() {
    return {
      inputPage: null,
      page: 1,
      perpage: 20,
      deleteId: null,
      deleteConfirm: false,
    };
  },
  mounted() {
    // @ts-ignore
    (this as any).fetchList();

    this.loadPaginationFromUrl();
  },
});
</script>
<style lang="scss">
.table-datatable table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
.v-data-table .v-data-footer {
  display: none !important;
  background: red;
}
.user {
  span {
    position: relative;
    left: -10px;
  }
}
.footer-v2 {
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
</style>
