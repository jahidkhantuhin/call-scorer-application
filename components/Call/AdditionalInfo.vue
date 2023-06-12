<template>
  <div class="additional-info">
    <v-card
      :class="{
        'mx-auto additional-card': true,
      }"
      light
      :style="{ background: $store.getters['theme/themeBackgroundCard'],}"
      outlined
    >
    <!-- <div class="d-flex justify-center"> -->
      <v-card-title class="mt-n4 d-flex justify-center">
        <span class="mt-n4 text-center text-decoration-underline">
          Lead Details
        </span> 
      </v-card-title>
    <!-- </div> -->
      <v-card-text class="mt-n4">
        <v-card-title class="ml-n4">
          <span
            :class="{
                'mt-n4': true,
                'text-break': true,
            }"
            > Patient`s Name
            <span style="color: red">
              {{$store.getters['calls/rules']['person_name_rules'] === 'required' ? ' *' : ''}}
            </span>
          </span>
        </v-card-title>
        <ValidationProvider name="person_name" :rules="rules.person_name && $store.getters['calls/rules']['person_name_rules']" v-slot="{ errors, valid }">
          <v-text-field
            class="mt-n4"
            v-model="personName"
            :dark="$vuetify.theme.isDark"
            outlined
            dense
          >
          </v-text-field> 
        </ValidationProvider>
        <ValidationProvider name="person_email" v-slot="{ errors, valid }">
          <v-text-field
            class="mt-n2"
            label="Email"
            v-model="personEmail"
            :dark="$vuetify.theme.isDark"
            outlined
            dense
            :success="valid"
            :error-messages="errors"
            :rules="rules.email"
          >
          </v-text-field> 
        </ValidationProvider>
        <ValidationProvider name="person_phone" v-slot="{ errors, valid }">
          <v-text-field
            class="mt-n2"
            label="Phone"
            v-model="personPhone"
            :dark="$vuetify.theme.isDark"
            outlined
            dense
            :success="valid"
            :error-messages="errors"
            :rules="rules.person_number"
          >
          </v-text-field> 
        </ValidationProvider>
        <v-row class="mt-n8">
          <v-col>
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="apptDate"
                  label="Appt date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :disabled="
                    $store.getters['calls/rules']['booking_date_and_time'] !== 'required'
                  "
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="apptDate"
                @input="menu1 = false"
                :disabled="
                  $store.getters['calls/rules']['booking_date_and_time'] !== 'required'
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-menu
              ref="menu"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="apptTime"
                  label="Appt time"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :disabled="
                    $store.getters['calls/rules']['booking_date_and_time'] !== 'required'
                  "
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="apptTime"
                :disabled="
                  $store.getters['calls/rules']['booking_date_and_time'] !== 'required'
                "
                full-width
                @click:minute="$refs.menu.save(time)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-card-title class="ml-n4">
          <span
            :class="{
                'mt-n4': true,
                'text-break': true,
            }"
            >
            Add a note
            <span style="color: red">
              {{$store.getters['calls/rules']['comment_rules'] === 'required' ? ' *' : ''}}
            </span>
          </span>
        </v-card-title>
        <ValidationProvider name="comment" :rules="$store.getters['calls/rules']['comment_rules']" v-slot="{ errors, valid }">
          <v-textarea
            class="mt-n4"
            outlined
            v-model="comment"
            :success="valid"
            :disabled="$store.getters['calls/rules']['comment'] !== 'required'"
            rows="5"
            :dark="$vuetify.theme.isDark"
            name="input-7-4"
          ></v-textarea>
        </ValidationProvider>
        <ValidationProvider name="blank_field" :rules="$store.getters['calls/rules']['blank_field']" v-slot="{ errors, valid }">
          <v-text-field
            class="mt-n16"
            variant="plain"
            v-model="blankField"
            v-show="$store.getters['calls/rules']['blank_field'] === 'required'"
          >
          </v-text-field> 
        </ValidationProvider>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  mounted() {
    this.comment = "";
    this.personName = "";
    this.whoAnswered = "";
  },
  data() {
    return {
    menu1: false,
    menu2: false,
    date: '',
    time: '',
    blankField: '',
    }
  },
  computed: {
    rules() {
      return {
        email: [
          // (v: string) => !!v || 'Email is required',
          (v: string) => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        person_name: [
          // (v: string) => !!v || 'Email is required',
          (v: string) => !v || 'E-mail must be valid',
        ],
        person_number: [
          (v: string) => {
            return !v || !/\D/.test(v) || 'Phone number must be numeric'
          },
        ],
      }
    },
    currentScoringCall() {
      return this.$store.getters["calls/currentScoringCall"];
    },
    personName: {
      get() {
        return (this as any).currentScoringCall["person_name"];
      },
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          person_name: val,
        });
      },
    },
    personPhone: {
      get() {
        return (this as any).currentScoringCall["person_phone"];
      },
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          person_phone: val,
        });
      },
    },
    personEmail: {
      get() {
        return (this as any).currentScoringCall["person_email"];
      },
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          person_email: val,
        });
      },
    },
    apptDate: {
      get() {
        return (this as any).currentScoringCall["appt_date"];
      },
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          appt_date: val,
        });
      },
    },
    apptTime: {
      get() {
        return (this as any).currentScoringCall["appt_time"];
      },
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          appt_time: val,
        });
      },
    },
    comment: {
      get() {
        return (this as any).currentScoringCall["comment"];
      },
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          comment: val,
        });
      },
    },
    whoAnswered: {
      set: function (val) {
        this.$store.commit("calls/setScoreCallInformation", {
          who_answered: val,
        });
      },
      get: function () {
        // @ts-ignore
        return this.currentScoringCall["who_answered"];
      },
    },
  },
});
</script>

<style lang="scss">
.additional-info {
  .additional-card {
    
    border-radius: 5px !important;
    border: none !important;

    @media (min-height: 850px) {
      height: calc(100vh - 388px);
    }
  }
  .score {
    border-radius: 5px !important;
    border: none !important;
  }
  .radios {
    margin-top: -16px;
    position: relative;
    top: 5px;
  }
}
</style>
