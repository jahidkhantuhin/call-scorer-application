<template>
  <v-card light class="mx-auto call-status overflow-y-auto" outlined 
    :style="{ 
      background: $store.getters['theme/themeBackgroundCard'], overflow: 'hidden'}">
      <div>
          <!-- <v-card-title class="mt-n4 mb-n1">Call Status *</v-card-title> -->
          <v-row>
            <v-col cols="10" md="8" lg="10">
              <v-card-title class="mt-n4 mb-n1">Call Status <span style="color: red"> *</span></v-card-title>
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
        
      </div>
      <div v-if="$store.getters['calls/isAlreadyRated'] === false">
        <v-card-text class="mt-n8">
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
      <!-- <div v-if="step2 || step3 || step2 && step3" class="mt-n6" style="border-style: inset; background-color: #F0EDEC"> -->
        <div v-if="step2" class="mt-n6" style="background-color: #FAF7F6">
          <!-- <v-row>
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
          </v-row> -->
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
        <div v-if="step3" class="mt-n6" style="background-color: #F0EDEC">
          <!-- <v-row>
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
          </v-row> -->
          <v-card-text class="">
            <ValidationProvider name="call_status" :rules="$store.getters['calls/rules']['call_status']" v-slot="{ errors, valid }">
              <v-radio-group
                class="radio-list"
                :success="valid"
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
          <v-card-text v-if="stepThreeTextField" class="mt-n14">
            <v-text-field
            v-model="callStatus"
            label="Specify status"
            >

            </v-text-field>
          </v-card-text>
        </div>
      </div>
      <div v-if="$store.getters['calls/isAlreadyRated'] === true">
        <v-card-text> {{ ratedCallStatus }} </v-card-text>
      </div>
      <!-- </div> -->
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
          value: "live_answer_lead_booked",
        },
        {
          label: "Not Booked",
          value: "live_answer_lead_not_booked",
        },
      ],
      unrealLeadLabels: [
        {
          label: "Reschedule / cancel / confirm",
          value: "reschedule_cancel_confirm",
        },
        {
          label: "Wrong number",
          value: "wrong_number",
        },
        {
          label: "Vendor",
          value: "vendor",
        },
        {
          label: "Technical issues",
          value: "technical_issue",
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
        this.callStatus = '';
        this.$store.commit("calls/setScoreCallInformation", {
          call_status: null,
        });
        this.stepTwoCallStatus = '';
        this.stepThreeCallStatus = '';
        // this.step1 = false;
        this.step2 = true;
        this.stepThreeTextField = false;
        if (this.stepOneCallStatus === 'live_answer') {
          this.callStatus = 'live_answer';
          this.stepTwoStatusLabels = this.liveAnswerLabels
          this.step3 = false;
        }
        if (this.stepOneCallStatus === 'voicemail') {
          this.callStatus = 'voicemail_only';
          this.emptyAllFields();
          this.step3 = false;
          this.stepTwoStatusLabels = this.voiceMailLabels
        }
        if (this.stepOneCallStatus === 'technical_issue') {
          this.callStatus = 'technical_issue';
          this.emptyAllFields();
          this.step1 = true;
          this.step2 = false;
          this.step3 = false;
        }
      }
    },
    stepTwoStatusSelected() {
      if (this.stepTwoCallStatus !== null) {
        this.step1 = false;
        this.step2 = true;
        this.step3 = true;
        this.stepThreeTextField = false;
        if (this.stepTwoCallStatus === 'lead') {
          // this.stepTwoStatusLabels = []
          this.callStatus = 'live_answer_lead';
          this.stepThreeStatusLabels = this.realLeadLabels
        }
        if (this.stepTwoCallStatus === 'no_lead') {
          this.emptyPartialFields();
          this.callStatus = 'live_answer_no_lead';
          this.stepThreeStatusLabels = this.unrealLeadLabels
        }
        if (this.stepTwoCallStatus === 'message_left_no_lead') {
          this.callStatus = 'message_left_no_lead';
          this.emptyAllFields();
          this.step2 = true;
          this.step1 = false;
          this.step3 = false;
        }
        if (this.stepTwoCallStatus === 'message_left_lead') {
          this.emptyAllFields();
          this.callStatus = 'message_left_lead';
          this.step2 = true;
          this.step1 = false;
          this.step3 = false;
        }
        if (this.stepTwoCallStatus === 'voiceMail_no_lead') {
          this.emptyAllFields();
          this.callStatus = 'voiceMail_no_lead';
          this.step2 = true;
          this.step1 = false;
          this.step3 = false;
        }
      }
    },
    stepThreeStatusSelected() {
        // this.step2 = true;
      if (this.stepOneCallStatus !== null) {
        if (this.callStatus === 'wrong_number'
        || this.callStatus === 'technical_issue') {
            this.emptyAllFields();
        }
        if (this.callStatus === 'reschedule_cancel_confirm'
        || this.callStatus === 'vendor') {
          this.emptyPartialFields();
        }
        if (this.callStatus === 'live_answer_lead_not_booked') {
            this.$store.commit("calls/setScoreCallInformation", {
              person_name: '',
              appt_date: '',
              appt_time: '',
              comment: '',
              
            });
        }
        if (this.callStatus === 'others') {
          this.emptyPartialFields();
          this.stepThreeTextField = true
        } else this.stepThreeTextField = false
      }
    },
    emptyAllFields() {
      this.$store.commit("calls/setScoreCallInformation", {
          identify_office: '', 
          recipient_identify_themselves: '',
          booked_appointment: '',
          consult_offered: null,
          handler_pitch: null,
          caller_name_taken: null,
          who_answered: '',
          recipient_name: '',
          person_name: '',
          person_email: '',
          person_phone: '',
          procedure_id: '',
          appt_date: '',
          appt_time: '',
          comment: '',
        });
    },
    emptyPartialFields() {
      this.$store.commit("calls/setScoreCallInformation", {
          booked_appointment: '',
          consult_offered: null,
          handler_pitch: null,
          caller_name_taken: null,
          who_answered: '',
          person_name: '',
          person_email: '',
          person_phone: '',
          procedure_id: '',
          appt_date: '',
          appt_time: '',
          comment: '',
        });
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
      this.emptyAllFields();
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
    ratedCallStatus: {
      get() {
        // @ts-ignore
        return this.callStatus === 'live_answer_booked' ? 'Live answer - Booked'
        // @ts-ignore
        : this.callStatus === 'live_answer_not_booked' ? 'Live answer - Not Booked'
        // @ts-ignore
        : this.callStatus === 'voice_mail_require_appointment' ? 'Voicemail (Appt require)'
        // @ts-ignore
        : this.callStatus === 'voice_mail_not_require_appointment' ? 'Voicemail (Appt not require)'
        // @ts-ignore
        : this.callStatus === 'no_answer_hangup' ? 'No answer/hang-up'
        // @ts-ignore
        : this.callStatus === 'confirmed_appointment' ? 'Confirmed Appt'
        // @ts-ignore
        : this.callStatus === 'wrong_number' ? 'Wrong number'
        // @ts-ignore
        : this.callStatus === 'cancel' ? 'Cancel'
        // @ts-ignore
        : this.callStatus === 'reschedule' ? 'Reschedule'
        // @ts-ignore
        : this.callStatus === 'info_request' ? 'Info Request'
        // @ts-ignore
        : this.callStatus === 'technical_issues' ? 'Technical Issues'
        // @ts-ignore
        : this.callStatus === 'live_answer_lead' ? 'Live answer lead'
        // @ts-ignore
        : this.callStatus === 'live_answer_no_lead' ? 'Live answer no lead'
        // @ts-ignore
        : this.callStatus === 'live_answer_lead_booked' ? 'Live answer lead booked'
        // @ts-ignore
        : this.callStatus === 'live_answer_lead_not_booked' ? 'Live answer lead not booked'
        // @ts-ignore
        : this.callStatus === 'reschedule_cancel_confirm' ? 'Reschedule / cancel / confirm'
        // @ts-ignore
        : this.callStatus === 'vendor' ? 'Vendor'
        // @ts-ignore
        : this.callStatus === 'others' ? 'Others'
        // @ts-ignore
        : this.callStatus === 'message_left_no_lead' ? 'Voicemail - Message left: no lead'
        // @ts-ignore
        : this.callStatus === 'message_left_lead' ? 'Voicemail - Message left: lead'
        // @ts-ignore
        : this.callStatus === 'voiceMail_no_lead' ? 'Voicemail - no lead'
        : 'No status available'
      },
    }
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
