<template>
  <div>
    <v-row class="my-5">
      <v-col cols="12" md="12" lg="3">
        <v-card color="default" rounded class="min-h-300">
          <v-card-title>Select a date range</v-card-title>
          <v-card-text>
            <datepicker @clear="dates = []" v-model="dates"></datepicker>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="dates.length === 0"
              @click="fetchPaymentReport"
              class="my-2"
              :loading="generatingPaymentReportLoading"
              color="primary"
            >
              Apply
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col md="12" lg="9">
        <v-card v-if="generatingPaymentReportLoading">
          <v-card-text>
            <v-skeleton-loader
              type="table-heading, list-item-two-line, image, table-tfoot"
            ></v-skeleton-loader>
          </v-card-text>
        </v-card>
        <v-card v-else class="min-h-300">
          <v-toolbar flat>
            <v-toolbar-title> Report Details: </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              icon
              title="Reload the report"
              v-show="loaded"
              @click="fetchPaymentReport"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <!-- <v-btn
                :disabled="loaded === false"
                icon
                :loading="downloadReportLoading"
                @click="downloadReport"
                color="info"
                title="Download Report"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn> -->
          </v-toolbar>

          <!-- no filters selected -->
          <v-card-subtitle
            v-if="loaded === false && paymentReport.length === 0"
          >
            Please apply appropriate filters to see the data.
          </v-card-subtitle>

          <!-- nothing found -->
          <v-card-text v-if="loaded === true && paymentReport.length === 0">
            <v-alert color="info lighten-2"> No reports found. </v-alert>
          </v-card-text>

          <v-card-text>
            <report-generated
              :loading="downloadReportLoading"
              @download="downloadReport"
              :date="dates.join(',')"
              v-if="
                paymentReport.length > 0 &&
                generatingPaymentReportSuccess === true &&
                generatingPaymentReportLoading === false
              "
            ></report-generated>
          </v-card-text>

          <!-- CLient Info -->
          <v-card-text v-if="loaded === true && paymentReport.length > 0">
            Date: From {{ dates[0] }} to {{ dates[1] }}.
          </v-card-text>

          <!-- summary -->
          <payment-report-detail
            :payRate="payRate"
            :items="paymentReport"
            v-if="
              generatingPaymentReportSuccess === true &&
              generatingPaymentReportLoading === false
            "
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, useStore } from "@nuxtjs/composition-api";
import Datepicker from "~/components/forms/Datepicker.vue";
import ReportGenerated from "~/components/ReportGenerated.vue";
import PaymentReportDetail from "~/components/PaymentReportDetail.vue";
import exportToXLS from "~/utils/exportToXLS";

export default defineComponent({
  components: { Datepicker, PaymentReportDetail, ReportGenerated },
  head: {
    title: "Score Report",
  },
  setup(props, { parent }) {
    const generatingPaymentReportLoading = ref(false);
    const generatingPaymentReportSuccess = ref(false);
    const payRate = ref(null);
    const loaded = ref(false);
    const store = useStore()
    const dates = ref([]);
    const paymentReport = ref([]);

    const downloadReportLoading = ref(false);

    const fetchPaymentReport = () => {
      generatingPaymentReportLoading.value = true;
      generatingPaymentReportSuccess.value = true;
      loaded.value = false;
      parent?.$axios
        .get(
          `/reports?type=payment&user_id=${parent?.$auth?.user?.id}&from=${dates.value[0]}&to=${dates.value[1]}`,
          {
            withCredentials: true,
          }
        )
        .then((res: any) => {
          generatingPaymentReportLoading.value = false;
          generatingPaymentReportSuccess.value = true;
          loaded.value = true;
          if (res.data && res.data && res.data.data && res.data.data.ratings) {
            paymentReport.value = res.data.data.ratings;
            payRate.value = res.data.data.pay_rate;
          }
        })
        .catch((e: any) => {
          generatingPaymentReportLoading.value = false;
          generatingPaymentReportSuccess.value = false;
          loaded.value = true;
        });
    };

    const downloadReport = function () {
      downloadReportLoading.value = true;
      setTimeout(() => {
        downloadReportLoading.value = false;
        exportToXLS(
          "table",
          `score-report-${dates.value.join("-")}
          }-payment-report`.toLowerCase()
        );
      }, 1000);
    };

    onMounted(() => {
      store.commit("setPageTitle", "Score Report")
    })

    return {
      generatingPaymentReportLoading,
      dates,
      fetchPaymentReport,
      paymentReport,
      payRate,
      generatingPaymentReportSuccess,
      loaded,
      downloadReport,
      downloadReportLoading,
    };
  },
});
</script>
