<template>
  <v-row class="filters">
    <v-col v-if="selectedLocation && selectedLocation.id" cols="8" xl="2" lg="2" md="3" sm="8">
        <v-select
          id="rated"
          :items="campaignList"
          label="Ad Campaign"
          item-text="name"
          item-value="f_campaign_id"
          clearable
          v-model="filters['campaign']"
          @change="handleCampaignIdChange"
          small
        ></v-select>
    </v-col>
    <v-col cols="8" xl="2" lg="2" md="3" sm="8">
      <v-select
        ref="select"
        id="rated"
        :items="[
          {
            value: 'unrated',
            label: 'Not Rated',
          },
          {
            value: 'rated',
            label: 'Rated',
          },
          {
            value: 'all',
            label: 'All',
          },
        ]"
        label="Call Status"
        item-text="label"
        item-value="value"
        clearable
        v-model="filters['rated_type']"
        @change="handleCallStatusChange"
        small
      ></v-select>
    </v-col>
    <v-col cols="8" xl="2" lg="2" md="3" sm="8">
      <v-select
        ref="select"
        id="rated"
        :items="[
          {
            value: 'oldest',
            label: 'Oldest',
          },
          {
            value: 'latest',
            label: 'Latest',
          },
        ]"
        label="Order By"
        item-text="label"
        item-value="value"
        clearable
        v-model="filters['order_by']"
        @change="handleCallStatusChange"
        small
      ></v-select>
    </v-col>
    <v-col cols="8" xl="2" lg="2" md="3" sm="8">
      <v-select
        ref="select"
        id="rated"
        :items="[
          {
            value: 'true',
            label: 'Yes',
          },
          {
            value: 'false',
            label: 'No',
          },
        ]"
        label="Blacklisted Calls"
        item-text="label"
        item-value="value"
        clearable
        v-model="filters['blacklisted_call']"
        @change="handleBlacklistedCallChange"
        small
      ></v-select>
    </v-col>
    <v-col cols="8" xl="2" lg="2" md="3" sm="8">
      <v-select
        ref="select"
        id="rated"
        :items="[
          {
            value: 'english',
            label: 'English',
          },
          {
            value: 'spanish',
            label: 'Spanish',
          },
          {
            value: 'other',
            label: 'Other',
          },
        ]"
        label="Language"
        item-text="label"
        item-value="value"
        clearable
        v-model="filters['score_language']"
        @change="handleLanguageChange"
        small
      ></v-select>
    </v-col>
    <v-col cols="8" xl="2" lg="2" md="3" sm="8">
      <datepicker
        :value="filters['date_range']"
        @clear="onDateClear"
        @change="handleDateChange"
        v-model="filters['date_range']"
      ></datepicker>
    </v-col>
    <v-col cols="8" xl="2" lg="2" md="3" sm="8">
      <v-text-field
        class="text-input"
        type="text"
        id="call_marchex_id"
        clearable
        @change="handleChange"
        v-model="filters['call_marchex_id']"
        label="Marchex ID"
      ></v-text-field>
    </v-col>
    <v-col cols="8" xl="2" lg="2" md="3" sm="8">
      <v-text-field
        class="text-input"
        type="number"
        id="caller_number"
        clearable
        @change="handleChange"
        v-model="filters['caller_number']"
        label="Caller number"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Datepicker from "~/components/forms/Datepicker.vue";

const filters: { [key: string]: any } = {
  date: [],
  f_campaign_id: null,
};

export default Vue.extend({
  components: {
    Datepicker,
  },
  props: {
    selectedLocation: {
      type: Object,
      default: "",
    },
  },
  computed: {
    displayedDates: {
      get() {
        const _this: any = this;
        if (
          _this.filters.date_range &&
          typeof _this.filters.date_range === "string"
        ) {
          return _this.filters.date_range;
        }
        return (
          _this.filters.date_range &&
          _this.filters.date_range
            .map((d: any) => moment(d).format("DD MMM YYYY"))
            .join(" to ")
        );
      },
      set(v) {
        if (!v) {
          (this as any).filters.date_range = [];
        }
      },
    },
    filtersFromStore() {
      return this.$store.getters["calls/filters"];
    },
  },
  watch: {
    selectedLocation() {
      if (this.selectedLocation) {
        this.fetchCampaigns();
      } else this.campaignList = [];
    },
    $route() {
      this.loadFiltersFromURL();
    },
    filtersFromStore() {
      const length = Object.keys(this.filtersFromStore || {}).length;
      if (length === 0) {
        this.filters = {
          date: [],
        };
        (this.$refs["select"] as any).reset();
      }
      if (
        this.filtersFromStore["date_range"] &&
        this.filtersFromStore["date_range"].length > 0
      ) {
        this.filters["date_range"] = this.filtersFromStore["date_range"];
      }
    },
  },
  data() {
    return {
      filters: { ...filters },
      menu: false,
      modal: false,
      campaignList: [],
    };
  },
  methods: {
    onDateClear() {
      delete this.filters["date_range"];
      this.handleChange();
    },
    loadFiltersFromURL() {
      const filters = this.$route.query;
      delete filters["page"];
      delete filters["limit"];
      Object.keys(filters).map((name) => {
        const v = filters[name];
        if (v === null) {
          delete filters[name];
        }
      });

      if (filters.date_range && typeof filters.date_range === "string") {
        filters.date_range = [filters.date_range, filters.date_range];
      }

      this.filters = filters;
    },
    handleDateChange() {
      if (this.filters.date_range) {
        this.handleChange();
      }
    },
    setDate(val: String) {
      if (val === "this_week") {
        this.filters["date_range"] = [
          moment().startOf("isoWeek").format("YYYY-MM-DD"),
          moment().endOf("isoWeek").format("YYYY-MM-DD"),
        ];
      } else if (val === "last_week") {
        this.filters["date_range"] = [
          moment().subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD"),
          moment().subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD"),
        ];
      } else if (val === "this_month") {
        this.filters["date_range"] = [
          moment().startOf("month").format("YYYY-MM-DD"),
          moment().endOf("month").format("YYYY-MM-DD"),
        ];
      } else if (val === "last_month") {
        this.filters["date_range"] = [
          moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD"),
          moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD"),
        ];
      }
      this.handleChange();
    },
    handleCallStatusChange() {
      const filters = { ...this.filters };

      this.$store.commit("calls/deleteCallsFilter", { name: "unrated" });
      this.$store.commit("calls/deleteCallsFilter", { name: "rated" });

      delete filters["unrated"];
      delete filters["rated"];

      if (filters["rated_type"] !== "all") {
        filters[filters["rated_type"]] = "1";
      }

      delete filters["rated_type"];

      this.handleChange();
    },

    handleBlacklistedCallChange() {
      this.handleChange();
    },
    
    handleLanguageChange() {
      this.handleChange();
    },
    handleCampaignIdChange() {
      this.handleChange();
    },
    handleChange() {
      this.$emit("change", this.filters);
    },
    fetchCampaigns() {
      this.$axios
        .get(`locations/${this.selectedLocation.id}/campaigns`, {
          withCredentials: true,
        })
        .then((res) => {
          this.campaignList = res.data.data;
        });
    },
  },
  beforeMount() {
    this.filters = this.filtersFromStore;
    this.loadFiltersFromURL();
  },
});
</script>
<style lang="scss">
.filters {
  display: flex;
  > div {
    margin-right: 19px;
    .v-select {
      width: 160px;
    }
    .text-input {
      width: 150px;
    }
  }
}

.date-picker-dialog {
  margin-bottom: 10px;
}

.filter-date-range-actions {
  padding: 12px 20px;
  border: 1px solid #eee;
  border-left: none;
  border-right: none;
}

.filter-date-range-actions {
  .v-btn {
    padding: 0px 6px;
    font-size: 12px;
    margin-right: 0px;
    margin-bottom: 7px;
    text-transform: initial;
    height: 22px;
  }
}
.v-input__icon--clear {
  opacity: 0;
  visibility: hidden;
}
.v-input {
  &:hover {
    .v-input__icon--clear {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
