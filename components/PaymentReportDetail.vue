<template>
  <div class="payment-report-detail">
    <v-card-title> Payment Report </v-card-title>
    <v-card-text>
      <v-data-table
        id="table"
        :headers="headers"
        :items="modifiedReport.length > 0 ? [...modifiedReport, totals] : []"
        :items-per-page="5"
        :disable-pagination="true"
        :disable-filtering="true"
        :no-data-text="`No Reports found `"
        :hide-default-footer="true"
        :disable-sort="true"
        class="elevation-1 mb-3"
      >
        <template v-slot:item.total="props">
          <div>${{ props.item.total }}</div>
        </template>
        <template v-slot:item.pay_rate="props">
          <div>${{ props.item.pay_rate }}</div>
        </template>
        <template v-slot:item.total_call_duration="props">
          <div>{{ secondsToHHMMSS(props.item.total_call_duration) }}</div>
        </template>
        <template v-slot:item.total_rating_time="props">
          <div>{{ secondsToHHMMSS(props.item.total_rating_time) }}</div>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
import secondsToHHMMSS from './../utils/secondsToHHMMSS'

export default defineComponent({
  props: {
    items: Array,
    payRate: Number,
  },
  setup(props) {
    const headers = ref([
      {
        text: 'Clilent',
        value: 'name',
      },
      {
        text: 'Calls',
        value: 'total_calls',
      },
      {
        text: 'Total Call Time',
        value: 'total_call_duration',
      },
      {
        text: 'Total Rating Time',
        value: 'total_rating_time',
      },
    ])

    const totals = ref({
      name: 'Totals',
      total_calls: 0,
      total_call_duration: 0,
      total_rating_time: 0,
      pay_rate: 0,
      total: 0,
    })

    let modifiedReport = props.items.map((report) => {
      totals.value.total_calls = totals.value.total_calls + report.total_calls
      totals.value.total_call_duration =
        +totals.value.total_call_duration + report.total_call_duration
      totals.value.total_rating_time =
        +totals.value.total_rating_time + report.total_rating_time

      report.pay_rate = props.payRate

      return report
    })

    modifiedReport = modifiedReport.map((report) => {
      let reportTotal = props.payRate * (report.total_rating_time / 3600)
      reportTotal = reportTotal.toFixed(2)
      report.total = reportTotal
      let totalsTotal = +report.total + totals.value.total

      totals.value.total = +new Number(totalsTotal).toFixed(2)
      
      return report
    })

    totals.value.pay_rate = props.payRate

    return {
      modifiedReport,
      headers,
      // items,
      secondsToHHMMSS,
      totals,
    }
  },
})
</script>


<style lang="scss">
.payment-report-detail {
  margin-top: -10px;
  .v-data-footer {
    display: none;
  }
  table {
    tbody {
      tr {
        &:last-child {
          td {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>