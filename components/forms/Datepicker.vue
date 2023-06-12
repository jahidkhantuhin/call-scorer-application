<template>
  <v-menu
    v-model="showDatePicker"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
    @input="handleChange"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="displayedDates"
        clearable
        label="Date or Date Range"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        @click:clear="handleClickClear"
      ></v-text-field>
    </template>
    <v-card style="width: 290px">
      <v-date-picker
        v-model="dates"
        range
        @change="handleDatePickerChange"
        :min="moment('12 april 2021').format()"
        :max="moment().format()"
      ></v-date-picker>
      <v-card-text>
        <v-btn
          small
          class="mr-1 mb-2"
          elevation="0"
          @click="setDate('this_week')"
          >This week</v-btn
        >
        <v-btn
          small
          class="mr-1 mb-2"
          elevation="0"
          @click="setDate('last_week')"
          >Last Week</v-btn
        >
        <v-btn
          small
          class="mr-1 mb-2"
          elevation="0"
          @click="setDate('last_two_weeks')"
          >Last Two Weeks</v-btn
        >
        <v-btn
          small
          class="mr-1 mb-2"
          elevation="0"
          @click="setDate('this_month')"
          >This Month</v-btn
        >
        <v-btn
          small
          class="mr-1 mb-2"
          elevation="0"
          @click="setDate('last_month')"
          >Last Month</v-btn
        >
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script>
import {
  defineComponent,
  ref,
  computed,
  emit,
  onMounted,
  watch,
} from "@nuxtjs/composition-api";
import moment from "moment";
export default defineComponent({
  props: {
    value: [String, Array],
  },
  setup(props, app) {
    const showDatePicker = ref(false);
    const dates = ref([]);
    const displayedDates = computed({
      get: () =>
        dates.value.map((d) => moment(d).format("DD MMMM YYYY")).join(" to "),
      set: (v) => {
        if (!v) {
          dates.value = [];
        }
      },
    });
    const setDate = function (val) {
      if (val === "this_week") {
        dates.value = [
          moment().startOf("isoWeek").format("YYYY-MM-DD"),
          moment().endOf("isoWeek").format("YYYY-MM-DD"),
        ];
      } else if (val === "last_week") {
        dates.value = [
          moment().subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD"),
          moment().subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD"),
        ];
      } else if (val === "this_month") {
        dates.value = [
          moment().startOf("month").format("YYYY-MM-DD"),
          moment().endOf("month").format("YYYY-MM-DD"),
        ];
      } else if (val === "last_month") {
        dates.value = [
          moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD"),
          moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD"),
        ];
      } else if (val === "last_two_weeks") {
        dates.value = [
          moment().subtract(2, "weeks").startOf("isoWeek").format("YYYY-MM-DD"),
          moment().subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD"),
        ];
      } else if (val === "last_year") {
        dates.value = [
          moment().subtract(1, "years").startOf("years").format("YYYY-MM-DD"),
          moment().subtract(1, "years").endOf("years").format("YYYY-MM-DD"),
        ];
      } else if (val === "this_year") {
        dates.value = [
          moment().startOf("years").format("YYYY-MM-DD"),
          moment().endOf("years").format("YYYY-MM-DD"),
        ];
      }
      showDatePicker.value = false;
      app.emit("input", dates.value);
      app.emit("change", dates.value);
    };
    const handleChange = () => {
      handleDatePickerChange();
      app.emit("input", dates.value);
      if (showDatePicker.value === false) {
        app.emit("change", dates.value);
      }
    };
    const handleClickClear = () => {
      app.emit("input", dates.value);
      app.emit("clear");
    };

    const setValuetoDates = () => {
      if (props.value && props.value.constructor === Array) {
        dates.value = props.value;
      } else {
        dates.value = [];
      }
    };

    const handleDatePickerChange = () => {
      if (dates.value.length > 1) {
        if (moment(dates.value[0]).isAfter(dates.value[1])) {
          dates.value = [dates.value[1], dates.value[0]];
        }
      } else if (dates.value.length === 1) {
        dates.value = [dates.value[0], dates.value[0]];
      }
    };

    watch(
      () => props.value,
      () => {
        setValuetoDates();
      }
    );

    onMounted(() => {
      setValuetoDates();
    });

    return {
      showDatePicker,
      handleChange,
      displayedDates,
      handleDatePickerChange,
      dates,
      setDate,
      handleClickClear,
      moment,
    };
  },
});
</script>
