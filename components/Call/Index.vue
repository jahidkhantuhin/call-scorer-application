<template>
  <secured-component :permission="'score call'" :show-message="true">
    <div
      :class="{
        'call-score-page': true,
        'call-score-page-dark': $vuetify.theme.isDark,
      }"
    >
      <ValidationObserver ref="validation" v-slot="{ invalid }">
        <div
          class="loader"
          v-if="
            $store.getters['calls/singleFetchLoading'] ||
            $store.getters['calls/fetchRatedCallLoading']
          "
        >
          <v-container class="auth-page" fill-height fluid>
            <v-row align="center" justify="center">
              <div class="inner">
                <v-progress-circular
                  indeterminate
                  width="2"
                  color="black darken-5"
                ></v-progress-circular>
              </div>
            </v-row>
          </v-container>
        </div>
        <v-row>
          <v-col cols="12" sm="12" md="4">
            <call-info />
            <identify-office class="mt-5"/>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <call-status />
            <additional-info class="mt-5" />
          </v-col>
          <v-col cols="12" sm="8" md="4">
            <v-card
              light
              class="mx-auto call-actions py-5 mb-5"
              outlined
              :style="{
                background: $store.getters['theme/themeBackgroundCard'],
              }"
            >
              <v-card-text
                v-if="$store.getters['calls/isAlreadyRated'] === false"
                class="py-1 card-inner text-center card-actions"
              >
                <v-btn
                  block
                  :dark="$vuetify.theme.isDark"
                  class=""
                  @click="blacklistCallConfirm = true"
                  depressed
                  color="error"
                >
                <!-- :disabled="loadingMp3Failed === true" functionality removed to make sure the button is clickable despite no url available-->
                  Blacklist
                </v-btn>

                <v-btn
                  block
                  :disabled="invalid"
                  class="score-call-button"
                  @click="handleScoreCall"
                  depressed
                  color="primary"
                  :loading="$store.getters['calls/scoreCallLoading']"
                >
                <!-- :disabled="loadingMp3Failed === true" functionality removed to make sure the button is clickable despite no url available-->
                  Score Call
                </v-btn>
              </v-card-text>
              <v-card-text v-else><span> This call is already<strong> {{ $route.query.blacklisted_call ? 'blacklisted' : 'rated' }}</strong>.</span> </v-card-text>
            </v-card>
            <procedures  />

          </v-col>

          <v-dialog persistent v-model="blacklistCallConfirm" max-width="290">
            <v-card>
              <v-card-title class="headline"> Blacklist Call? </v-card-title>
              <v-card-text>
                Please confirm one more time before blacklisting a call.
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="$store.getters['calls/blacklistCallLoading']"
                  color=" darken-1"
                  text
                  @click="blacklistCallConfirm = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  :loading="$store.getters['calls/blacklistCallLoading']"
                  depressed
                  color="error"
                  @click="handleBlacklistCall"
                  :disabled="isSuperAdmin"
                >
                  Blacklist Call
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </ValidationObserver>
    </div>
  </secured-component>
</template>
<script lang="ts">
import IdentifyOffice from "~/components/Call/IdentifyOffice.vue";
import CallStatus from "~/components/Call/CallStatus.vue";
import AdditionalInfo from "~/components/Call/AdditionalInfo.vue";
import Procedures from "~/components/Call/Procedures.vue";
import CallInfo from "~/components/Call/CallInfo.vue";

import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      blacklistCallConfirm: false,
    };
  },
  computed: {
    callScoringRules() {
      return this.$store.getters["calls/rules"];
    },
    currentScoringCall() {
      return this.$store.getters["calls/currentScoringCall"];
    },
    scoreCallErrors() {
      return this.$store.getters["calls/scoreCallErrors"];
    },
    loadingMp3Failed() {
      return this.$store.getters["calls/loadingMp3Failed"];
    },
    isSuperAdmin() {
      return (this.$auth.user as any)?.role_id < 2;
    },
    callInfo() {
      const obj = this.$store.getters["calls/fetchSingleRes"];
      return obj && obj.data ? obj.data : {};
    },
  },
  beforeMount() {
    this.$store.commit("calls/resetScoringCall");
  },
  mounted() {
    this.$store.commit("calls/setScoreCallSubmited", false);
    this.$store.commit("calls/setisAlreadyRated", false);
    const _this = this;
    const { id } = this.$route.params;

    _this.$store.dispatch("procedures/fetchProcedures");
    _this.$store.commit("calls/setCurrentScoringCall", {});
    setTimeout(() => {
      _this.$store.dispatch("calls/fetchSingle", {
        id,
        onFail: (err: any) => {
          if (err.response && err.response.status === 404) {
            _this.$nuxt.error({ statusCode: 404, message: "Call not found" });
          }
        },
        afterFetch: (res: any) => {
          _this.$store.commit("calls/setRatingCall", res.data);
          _this.$store.dispatch("calls/fetchRatedCall", id);
        },
      });
    }, 300);
  },
  methods: {
    handleScoreCall() {
      this.$store.commit("calls/setScoreCallSubmited", true);
      this.$store.dispatch("calls/scoreCall", {
        call_id: this.$route.params.id,
        order_by: this.$route.query.order_by,
        date_range: this.$route.query.date_range,
      });
    },
    handleBlacklistCall() {
      const _this = this;
      this.$store.dispatch("calls/blacklistCall", {
        call_id: this.$route.params.id,
        onBlackList() {
          _this.blacklistCallConfirm = false;
          _this.$router.push("/calls");
        },
      });
    },
  },
  watch: {
    scoreCallErrors() {
      const validation = this.$refs.validation;
      // @ts-ignore
      // validation.setErrors(this.scoreCallErrors);
      // Todo show a toast notification here.
    },
  },
  components: {
    IdentifyOffice,
    CallStatus,
    AdditionalInfo,
    Procedures,
    CallInfo,
  },
});
</script>
<style lang="scss">
.call-score-page {
  position: relative;
  &.call-score-page-dark {
    .v-input--radio-group .v-label,
    .v-card .v-card__title {
      color: #939393 !important;
    }
  }
  .loader {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: #ffffffdb;
  }
  .card-actions {
    display: flex !important;
    justify-content: center;
  }
  .v-input--radio-group .v-label,
  .v-card .v-card__title {
    color: #263238 !important;
  }
  .v-input--radio-group .v-label {
    font-size: 12px;
  }
  .call-actions {
    border: 0px;
    .v-card__text {
      display: flex;
      button {
        min-width: 50% !important;
        margin-right: 5px;
      }
    }
  }
  .radio-column {
    padding: 0px 12px;
    margin-bottom: 8px;
  }
}
</style>
