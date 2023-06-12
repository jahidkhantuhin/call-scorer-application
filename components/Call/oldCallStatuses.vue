<template>
  <v-card light class="mx-auto call-status overflow-y-auto" outlined 
    :style="{ 
      background: $store.getters['theme/themeBackgroundCard'], overflow: 'hidden'}">
      <!-- UPDATE #1 FORMAT -->
      
      <div>
        <div v-if="step1">
            <v-card-title class="mt-n4 mb-n1">Call Status *</v-card-title>
          <v-card-text class="">
            <ValidationProvider name="call_status" :rules="$store.getters['calls/rules']['call_status']" v-slot="{ errors, valid }">
              <v-radio-group
                class="radio-list"
                v-model="stepOneCallStatus"
                @change="stepOneStatusSelected"
                :disabled="($store.getters['calls/isAlreadyRated'] === true) || ($store.getters['calls/rules']['call_status'] !== 'required')"
              >
              <!-- $store.getters['calls/loadingMp3Failed'] === true - option removed from the button disabled functionality -->
                <v-row>
                  <v-col :id="label.value" class="radio-column" cols="12" sm="6" md="6" lg="6" xl="6" v-for="(label, index) in stepOneStatusLabels" :key="index">
                    <v-radio class="mt-n1"  :dark="$vuetify.theme.isDark" :label="label.label" :value="label.value">
                      <span slot="label" class="">
                        {{ label.label }}
                      </span>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </ValidationProvider>
          </v-card-text>
        </div>
        <div v-if="step2">
          <v-row>
            <v-col cols="10" md="8" lg="10">
              <v-card-title class="mt-n4 mb-n1">Call Status *</v-card-title>
            </v-col>
            <v-col>
              <v-btn
                icon
                @click="resetCallStatus"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-text class="">
            <ValidationProvider name="call_status" :rules="$store.getters['calls/rules']['call_status']" v-slot="{ errors, valid }">
              <v-radio-group
                class="radio-list"
                v-model="stepTwoCallStatus"
                @change="stepTwoStatusSelected"
              >
              <!-- $store.getters['calls/loadingMp3Failed'] === true - option removed from the button disabled functionality -->
                <v-row>
                  <v-col :id="label.value" class="radio-column" cols="12" sm="6" md="6" lg="6" xl="6" v-for="(label, index) in stepTwoStatusLabels" :key="index">
                    <v-radio class="mt-n1"  :dark="$vuetify.theme.isDark" :label="label.label" :value="label.value">
                      <span slot="label" class="">
                        {{ label.label }}
                      </span>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </ValidationProvider>
          </v-card-text>
        </div>
        <div v-if="step3">
          <v-row>
            <v-col cols="10" md="8" lg="10">
              <v-card-title class="mt-n4 mb-n1">Call Status *</v-card-title>
            </v-col>
            <v-col>
              <v-btn
                icon
                @click="resetCallStatus"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-text class="">
            <ValidationProvider name="call_status" :rules="$store.getters['calls/rules']['call_status']" v-slot="{ errors, valid }">
              <v-radio-group
                class="radio-list"
                :success="valid"
                :error-messages="errors"
                v-model="callStatus"
                @change="stepThreeStatusSelected"
                :disabled="($store.getters['calls/isAlreadyRated'] === true) || ($store.getters['calls/rules']['call_status'] !== 'required')"
              >
              <!-- $store.getters['calls/loadingMp3Failed'] === true - option removed from the button disabled functionality -->
                <v-row>
                  <v-col :id="label.value" class="radio-column" cols="12" sm="6" md="6" lg="6" xl="6" v-for="(label, index) in stepThreeStatusLabels" :key="index">
                    <v-radio class="mt-n1"  :dark="$vuetify.theme.isDark" :label="label.label" :value="label.value">
                      <span slot="label" class="">
                        {{ label.label }}
                      </span>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </ValidationProvider>
            <!-- <ValidationProvider name="who_answered" :rules="$store.getters['calls/rules']['who_answered']" v-slot="{ errors, valid }">
              <v-text-field
                @change="
                  $store.commit('calls/setScoreCallInformation', {
                    who_answered: whoAnswered,
                  })
                "
                :disabled="$store.getters['calls/rules']['who_answered'] !== 'required' || $store.getters['calls/loadingMp3Failed'] === true"
                label="Who answered"
                :success="valid"
                :error-messages="errors"
                class="input-field"
                v-model="whoAnswered"
                :dark="$vuetify.theme.isDark"
                outlined
                dense
              ></v-text-field>
            </ValidationProvider> -->
          </v-card-text>
          <v-card-text v-if="stepThreeTextField" class="mt-n12">
            <v-text-field
            v-model="call_status"
            label="Specify status"
            >

            </v-text-field>
          </v-card-text>
        </div>
      </div>
      <!-- Old format. -->
    <!-- <v-card-title class="mt-n4 mb-n1">Call Status *</v-card-title>
    <v-card-text class="">
      <ValidationProvider name="call_status" :rules="$store.getters['calls/rules']['call_status']" v-slot="{ errors, valid }">
        <v-radio-group
          class="radio-list"
          :success="valid"
          :error-messages="errors"
          v-model="callStatus"
          :disabled="($store.getters['calls/isAlreadyRated'] === true) || ($store.getters['calls/rules']['call_status'] !== 'required')"
        >
        $store.getters['calls/loadingMp3Failed'] === true - option removed from the button disabled functionality
          <v-row>
            <v-col :id="label.value" class="radio-column" cols="12" sm="6" md="6" lg="6" xl="6" v-for="(label, index) in stepThreeStatusLabels" :key="index">
              <v-radio class="mt-n1"  :dark="$vuetify.theme.isDark" :label="label.label" :value="label.value">
                <span slot="label" class="">
                  {{ label.label }}
                </span>
              </v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </ValidationProvider>
      *****This below part was abandoned earlier*****
      <ValidationProvider name="who_answered" :rules="$store.getters['calls/rules']['who_answered']" v-slot="{ errors, valid }">
        <v-text-field
          @change="
            $store.commit('calls/setScoreCallInformation', {
              who_answered: whoAnswered,
            })
          "
          :disabled="$store.getters['calls/rules']['who_answered'] !== 'required' || $store.getters['calls/loadingMp3Failed'] === true"
          label="Who answered"
          :success="valid"
          :error-messages="errors"
          class="input-field"
          v-model="whoAnswered"
          :dark="$vuetify.theme.isDark"
          outlined
          dense
        ></v-text-field>
      </ValidationProvider>
    </v-card-text> -->
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  mounted() {
    this.callStatus = "";
    // this.whoAnswered = "";
  },
  data() {
    return {
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      stepThreeTextField: false,
      stepOneCallStatus: '',
      stepTwoCallStatus: '',
      stepThreeCallStatus: '',
      stepTwoStatusLabels: <any> [],
      stepThreeStatusLabels: <any> [],
      stepFourStatusLabels: <any> [],
      stepOneStatusLabels: [
        {
          label: "Live Answer",
          value: "live_answer",
        },
        {
          label: "Technical Issue / Spam or Robocall",
          value: "technical_issue",
        },
        {
          label: "Voice Mail",
          value: "voicemail",
        },
      ],
      liveAnswerLabels: [
        {
          label: "Lead",
          value: "lead",
        },
        {
          label: "No Lead",
          value: "no_lead",
        },
      ],
      realLeadLabels: [
        {
          label: "Booked",
          value: "live_answer_booked",
        },
        {
          label: "Not Booked",
          value: "live_answer_not_booked",
        },
      ],
      unrealLeadLabels: [
        {
          label: "Reschedule / cancel / confirm",
          value: "live_answer_booked",
        },
        {
          label: "Wrong number",
          value: "live_answer_not_booked",
        },
        {
          label: "Vendor",
          value: "voice_mail_require_appointment",
        },
        {
          label: "Technical issues",
          value: "voice_mail_not_require_appointment",
        },
        {
          label: "Others",
          value: "others",
        },
      ],
      voiceMailLabels: [
        {
          label: "Message left: no lead",
          value: "message_left_no_lead",
        },
        {
          label: "Message left: lead",
          value: "message_left_lead",
        },
        {
          label: "No lead",
          value: "voiceMail_no_lead",
        },
      ],
      // labels: [
      //   {
      //     label: "Live answer - Booked",
      //     value: "live_answer_booked",
      //   },
      //   {
      //     label: "Live answer - Not Booked",
      //     value: "live_answer_not_booked",
      //   },
      //   {
      //     label: "Voicemail (Appt require)",
      //     value: "voice_mail_require_appointment",
      //   },
      //   {
      //     label: "Voicemail (Appt not require)",
      //     value: "voice_mail_not_require_appointment",
      //   },
      //   {
      //     label: "No answer/hang-up",
      //     value: "no_answer_hangup",
      //   },
      //   {
      //     label: "Confirmed Appt",
      //     value: "confirmed_appointment",
      //   },
      //   {
      //     label: "Wrong number",
      //     value: "wrong_number",
      //   },
      //   {
      //     label: "Cancel",
      //     value: "cancel",
      //   },
      //   {
      //     label: "Reschedule",
      //     value: "reschedule",
      //   },
      //   // {
      //   //   label: "Info Request",
      //   //   value: "info_request",
      //   // },
      //   {
      //     label: "Technical Issues",
      //     value: "technical_issues",
      //   },
      // ],
    };
  },
  methods: {
    stepOneStatusSelected() {
      if (this.stepOneCallStatus !== null) {
        this.step1 = false;
        this.step2 = true;
        if (this.stepOneCallStatus === 'live_answer') {
          this.stepTwoStatusLabels = this.liveAnswerLabels
        }
        if (this.stepOneCallStatus === 'voicemail') {
          this.stepTwoStatusLabels = this.voiceMailLabels
        }
        if (this.stepOneCallStatus === 'technical_issue') {
          this.callStatus = 'technical_issue';
          this.step1 = true;
          this.step2 = false;
          this.step3 = false;
        }
      }
    },
    stepTwoStatusSelected() {
      if (this.stepTwoCallStatus !== null) {
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;
        if (this.stepTwoCallStatus === 'lead') {
          this.stepThreeStatusLabels = this.realLeadLabels
        }
        if (this.stepTwoCallStatus === 'no_lead') {
          this.stepThreeStatusLabels = this.unrealLeadLabels
        }
        if (this.stepTwoCallStatus === 'message_left_no_lead') {
          this.callStatus = 'voice_mail_require_appointment';
          this.step2 = true;
          this.step1 = false;
          this.step3 = false;
        }
        if (this.stepTwoCallStatus === 'message_left_lead') {
          this.callStatus = 'voice_mail_not_require_appointment';
          this.step2 = true;
          this.step1 = false;
          this.step3 = false;
        }
        if (this.stepTwoCallStatus === 'voiceMail_no_lead') {
          this.callStatus = 'voice_mail_not_require_appointment';
          this.step2 = true;
          this.step1 = false;
          this.step3 = false;
        }
      }
    },
    stepThreeStatusSelected() {
      if (this.stepOneCallStatus !== null) {
        if (this.callStatus === 'others') {
          this.stepThreeTextField = true
        } else this.stepThreeTextField = false
      }
    },
    resetCallStatus() {
      this.callStatus = '';
      this.stepOneCallStatus = '';
      this.stepTwoCallStatus = '';
      this.stepThreeCallStatus = '';
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.stepThreeTextField = false;
    }
  },
  computed: {
    currentScoringCall() {
      return this.$store.getters["calls/currentScoringCall"];
    },
    callStatus: {
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          call_status: val,
        });
      },
      get() {
        // @ts-ignore
        return this.currentScoringCall["call_status"];
      },
    },
    // stepTwoStatusLabels() {
    //   return this.stepOneCallStatus === 'live_answer' ? this.liveAnswerlabels :
    //   this.stepOneCallStatus === 'technical_issue' ? this.call_status = 'technical_issue' :
    //   this.stepOneCallStatus === 'voicemail' ? this.voiceMailLabels : ''
    // }
    // whoAnswered: {
    //   set: function (val) {
    //     this.$store.commit("calls/setScoreCallInformation", {
    //       who_answered: val,
    //     });
    //   },
    //   get: function () {
    //     // @ts-ignore
    //     return this.currentScoringCall["who_answered"];
    //   },
    // },
  },
  
});
</script>

<style lang="scss">
.call-status {
  border-radius: 5px !important;
  border: none !important;
  height: 250px;
  .input-field {
    margin-top: 1px;
  }
  .radio-list {
    margin-top: 0px;
  }
}
</style>
