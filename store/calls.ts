import crudStore from "~/traits/crudStore";
import { get } from "lodash";

const callStore = crudStore("Calls");

const scoreCallSingleton = {
  can_understand: "yes",
};

const callsState: {
  [key: string]: any;
} = {
  scoreCallLoading: false,
  isAlreadyRated: false,
  isListeningAudio: false,
  callLoadFailed: false,
  scoreCall: { ...scoreCallSingleton },

  scoreCallIsSubmit: false,
  fetchRatedCallLoading: false,

  blacklistCall: {
    loading: false,
  },
  scoreCallErrors: {},
  ratingCall: {},
  loadingMp3Failed: false,
};

export const state = {
  ...callStore.state,
  ...callsState,
};

export const mutations = {
  ...callStore.mutations,
  resetScoringCall(state: any) {
    const keys = Object.keys(callsState);
    keys.forEach((key: string) => {
      state[key] = callsState[key];
    });
  },
  setLoadingMp3Failed(state: any, payload: Boolean) {
    state.loadingMp3Failed = payload;
  },
  setRatingCall(state: any, payload: any) {
    state.ratingCall = payload;
  },
  setIsListeningAudio(state: any, payload: Boolean) {
    state.isListeningAudio = payload;
  },
  setScoreCallInformation(
    state: any,
    payload: {
      [key: string]: any;
    }
  ) {
    const _this: any = this;
    Object.keys(payload).forEach((key) => {
      const old = { ...state.scoreCall };
      old[key] = payload[key];
      state.scoreCall = old;
    });
  },
  setScoreCallErrors(state: any, payload: any) {
    state.scoreCallErrors = payload;
  },
  setScoreCallLoading(state: any, payload: Boolean) {
    state.scoreCallLoading = payload;
  },
  setScoreCallSubmited(state: any, payload: Boolean) {
    state.scoreCallIsSubmit = payload;
  },
  setisAlreadyRated(state: any, payload: Boolean) {
    state.isAlreadyRated = payload;
  },
  setFetchRatedCallLoading(state: any, payload: Boolean) {
    state.fetchRatedCallLoading = payload;
  },
  setCallLoadFailed(state: any, payload: Boolean) {
    state.callLoadFailed = payload;
  },
  setCurrentScoringCallFromApi(state: any, payload: Object) {
    const data: any = { ...payload };
    data.procedure_id = data.procedure?.id;
    delete data["procedure"];
    state.scoreCall = data;
  },
  setCurrentScoringCall(state: any, payload: Object) {
    state.scoreCall = payload;
  },
  updateBlacklistCall(state: any, payload: any) {
    Object.keys(payload).forEach((key) => {
      state.blacklistCall[key] = payload[key];
    });
  },
};
export const actions = {
  ...callStore.actions,
  fetchRatedCall(app: any, payload: any) {
    // @ts-ignore
    const $axios: any = this.$axios;
    app.commit("setFetchRatedCallLoading", true);

    $axios
      .get(`/calls/${payload}/score`)
      .then((r: any) => {
        const data = r.data?.data;
        if (data && data.constructor === Object) {
          app.commit("setCurrentScoringCallFromApi", data);
          app.commit("setCallLoadFailed", false);
          app.commit("setFetchRatedCallLoading", false);
          app.commit("setisAlreadyRated", true);
        } else {
          app.commit("setFetchRatedCallLoading", false);
          app.commit("setCurrentScoringCallFromApi", {
            ...scoreCallSingleton,
          });
          app.commit("setisAlreadyRated", false);
          app.commit("setCallLoadFailed", false);
        }
      })
      .catch((error: any) => {
        console.log(error);
        app.commit(
          "snackbar/showSnackbar",
          {
            text: "Something went wrong while fetching call details.",
          },
          { root: true }
        );
        app.commit("setFetchRatedCallLoading", false);
        app.commit("setCurrentScoringCallFromApi", {});
        app.commit("setisAlreadyRated", false);
        app.commit("setCallLoadFailed", true);
      });
  },
  blacklistCall(app: any, payload: any) {
    // @ts-ignore
    const $axios: any = this.$axios;
    app.commit("updateBlacklistCall", {
      loading: true,
    });
    $axios
      .post(
        `/calls/${payload.call_id}/blacklist`,
        {
          call_id: +payload.call_id,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        app.commit("updateBlacklistCall", {
          loading: false,
        });
        app.commit(
          "snackbar/showSnackbar",
          {
            text: "Call Blacklisted",
          },
          { root: true }
        );
        payload.onBlackList();
      })
      .catch(() => {
        app.commit(
          "snackbar/showSnackbar",
          {
            text: "Something went wrong while blacklisting call.",
          },
          { root: true }
        );
        app.commit("updateBlacklistCall", {
          loading: false,
        });
      });
  },
  scoreCall(app: any, payload: any) {
    // @ts-ignore
    const $axios: any = this.$axios;
    const _this: any = this;
    const scoreCall = { ...app.state.scoreCall };
    scoreCall.call_id = +payload.call_id;
    scoreCall.user_id = +app.rootState.auth.user?.id;
    scoreCall.status = "rated";
    scoreCall.other_language = app.state.scoreCall.can_understand === "no" ? 'spanish' : '';
    scoreCall.date_range = payload.date_range;

    const rules = _this.getters["calls/rules"];

    Object.keys(rules).forEach((key) => {
      if (
        scoreCall[key] &&
        rules[key].includes("required") === false &&
        key !== "call_status" &&
        key !== "language"
      ) {
        delete scoreCall[key];
      }
    });

    delete scoreCall["id"];

    app.commit("setScoreCallLoading", true);
    $axios
      .post(`/calls/${payload.call_id}/score?order_by=${payload.order_by? 'latest' : 'oldest'}`, scoreCall, {
        withCredentials: true,
      })
      .then((res: any) => {
        app.commit("setScoreCallErrors", {});
        app.commit("setScoreCallLoading", false);
        app.commit(
          "snackbar/showSnackbar",
          {
            text: "Call Scored",
          },
          { root: true }
        );
        const nextCallId = get(res, "data.data.call_id", null);

        if (nextCallId) {
          setTimeout(() => {
            window.location.href = `/call/${nextCallId}${window.location.search}`;
          },1500)
        } else {
          (_this as any).$router.push(`/calls${window.location.search}`);
        }
      })
      .catch((e: any) => {
        const errors = get(e, "response.data.errors", {});
        app.commit("setScoreCallErrors", errors);
        app.commit("setScoreCallLoading", false);
        app.commit(
          "snackbar/showSnackbar",
          {
            text: "Something went wrong while scoring a call",
          },
          { root: true }
        );
      });
  },
};
export const getters = {
  ...callStore.getters,
  loadingMp3Failed: (state: any) => {
    return state.loadingMp3Failed;
  },
  ratingCall: (state: any) => {
    return state.ratingCall;
  },
  blacklistCallLoading: (state: any) => {
    return state.blacklistCall.loading;
  },
  isListeningAudio: (state: any) => {
    return state.isListeningAudio;
  },
  currentScoringCall(state: any) {
    return state.scoreCall;
  },
  scoreCallLoading: (state: any) => state.scoreCallLoading,
  scoreCallErrors(state: any) {
    return state.scoreCallErrors;
  },
  fetchRatedCallLoading(state: any) {
    return state.fetchRatedCallLoading;
  },
  isAlreadyRated(state: any) {
    return state.isAlreadyRated;
  },
  callLoadFailed(state: any) {
    return state.callLoadFailed;
  },
  rules(state: any) {
    const currentScoringCall = state.scoreCall;
    const call_status = currentScoringCall.call_status;
    // const isLiveAnswer = call_status == "live_answer";
    const isLiveAnswerBooked = call_status == "live_answer_booked";
    const isLiveAnswerNotBooked = call_status == "live_answer_not_booked";
    const isLiveAnswerLead = call_status == "live_answer_lead";
    const isLiveAnswer = call_status == "live_answer";
    const isLiveAnswerNoLead = call_status == "live_answer_no_lead";
    const isConfirmedAppointment = call_status == "confirmed_appointment";
    const isVoiceMail = call_status === "voice_mail_require_appointment";
    const isVoiceMailWithoutAppt = call_status === "voice_mail_not_require_appointment";
    const isTechnicalIssues = call_status === "technical_issues";
    const isNoAnswerHangup = call_status === "no_answer_hangup";
    const isWrongNumber = call_status === "wrong_number";
    const isCancel = call_status === "cancel";
    const isReschedule = call_status === "reschedule";
    const isInfoRequest = call_status === "info_request";
    const isRescheduleCancelConfirm = call_status === "reschedule_cancel_confirm";
    const isVendor = call_status === "vendor";
    const isOthers = call_status === "others";
    const isMessageLeftNoLead = call_status === "message_left_no_lead";
    const isMessageLeftLead = call_status === "message_left_lead";
    const isVoicemailNoLead = call_status === "voiceMail_no_lead";
    const isLiveAnswerLeadBooked = call_status == "live_answer_lead_booked";
    const isLiveAnswerLeadNotBooked = call_status == "live_answer_lead_not_booked";
    const isVoiceMailOnly = call_status === "voicemail_only";


    const can_understand = currentScoringCall.can_understand === "no";

    // const hasBookedAppointment = currentScoringCall?.booked_appointment?.includes("yes");
    const hasBookedAppointment = isConfirmedAppointment;
    // const hasRescheduled = currentScoringCall?.booked_appointment?.includes(
    //   "reschedule"
    // );
    const hasRescheduled = call_status === "reschedule";

    const r = {
      call_status: !can_understand ? "required" : "",
      // who_answered: isLiveAnswerBooked || isLiveAnswerNotBooked || isConfirmedAppointment || isWrongNumber 
      // || isCancel || isReschedule || isInfoRequest ? "required" : "",

      who_answered: !can_understand && isLiveAnswerBooked 
      || !can_understand && isLiveAnswerLeadBooked
      || !can_understand && isLiveAnswerNotBooked
      || !can_understand && isLiveAnswerLeadNotBooked
      // || !can_understand && isLiveAnswerLead 
      || !can_understand && isConfirmedAppointment 
      || !can_understand && isCancel 
      || !can_understand && isReschedule 
      || !can_understand && isInfoRequest
      || !can_understand && isRescheduleCancelConfirm 
      || !can_understand && isVendor
      || !can_understand && isOthers
       ? 
      "required" : "",

      who_answered_rules: !can_understand && isLiveAnswerBooked 
      || !can_understand && isLiveAnswerLeadBooked
      // || !can_understand && isLiveAnswerLead 
      || !can_understand && isLiveAnswerNotBooked 
      || !can_understand && isLiveAnswerLeadNotBooked
      || !can_understand && isConfirmedAppointment
      || !can_understand && isCancel 
      || !can_understand && isReschedule 
      || !can_understand && isInfoRequest
      || !can_understand && isRescheduleCancelConfirm
      || !can_understand && isVendor
      || !can_understand && isOthers ? 
      "required" : "",

      identify_office: !can_understand && isLiveAnswerBooked
      || !can_understand && isLiveAnswerLeadBooked
      || !can_understand && isLiveAnswerLead  
      || !can_understand && isLiveAnswerNoLead 
      || !can_understand && isLiveAnswer  
      || !can_understand && isLiveAnswerNotBooked 
      || !can_understand && isLiveAnswerLeadNotBooked
      || !can_understand && isConfirmedAppointment 
      || !can_understand && isCancel 
      || !can_understand && isInfoRequest
      || !can_understand && isReschedule
      || !can_understand && isRescheduleCancelConfirm
      || !can_understand && isVendor
      || !can_understand && isOthers ? 
      "required" : "",
      procedure_id: !can_understand && isLiveAnswerBooked 
      || !can_understand && isLiveAnswerLeadBooked
      || !can_understand && isLiveAnswerLead 
      || !can_understand && isVoiceMail 
      || !can_understand && isLiveAnswerNotBooked
      || !can_understand && isLiveAnswerLeadNotBooked
      || !can_understand && isMessageLeftLead ? 
      "required" : "",
      booking_date_and_time: isLiveAnswerLeadBooked ? "required" : "",
      person_name: "required",
      person_name_rules:
      !can_understand && isLiveAnswerBooked 
      || !can_understand && isLiveAnswerLeadBooked
          ? "required"
          : "",
      consult_offered: !can_understand && isLiveAnswerBooked 
      || !can_understand && isLiveAnswerLeadBooked
      || !can_understand && isLiveAnswerLead 
      || !can_understand && isLiveAnswerNotBooked
      || !can_understand && isLiveAnswerLeadNotBooked ? 
      "required" : "",
      handler_pitch: !can_understand && isLiveAnswerBooked 
      || !can_understand && isLiveAnswerLeadBooked
      || !can_understand && isLiveAnswerLead 
      || !can_understand && isLiveAnswerNotBooked
      || !can_understand && isLiveAnswerLeadNotBooked ? 
      "required" : "",
      caller_name_taken: !can_understand && isLiveAnswerBooked 
      || !can_understand && isLiveAnswerLeadBooked
      || !can_understand && isLiveAnswerLead 
      || !can_understand && isLiveAnswerNotBooked
      || !can_understand && isLiveAnswerLeadNotBooked ? 
      "required" : "",

      // comment: 
      // !can_understand && isLiveAnswerBooked 
      // || !can_understand && isVoiceMail 
      // || !can_understand && isLiveAnswerNotBooked 
      // || !can_understand && isVoiceMailWithoutAppt 
      // || !can_understand && isConfirmedAppointment 
      // || !can_understand && isCancel
      // || !can_understand && isNoAnswerHangup
      // || !can_understand && isInfoRequest 
      // || !can_understand && isWrongNumber 
      // || !can_understand && isReschedule
      // || !can_understand && isTechnicalIssues
      //     ? "required" : "",
      comment: "required",
      comment_rules: 
      !can_understand && isMessageLeftLead ? 
      "required" : "",
      // comment_rules: "",

      language:
        !isTechnicalIssues && !isNoAnswerHangup && can_understand
          ? "required"
          : "",
      isLiveAnswerNotBooked: isLiveAnswerNotBooked,
      recipient_identify_themselves: !can_understand && isLiveAnswerBooked 
      || !can_understand && isLiveAnswerLeadBooked
      || !can_understand && isLiveAnswerLead 
      || !can_understand && isLiveAnswerNoLead 
      || !can_understand && isLiveAnswer
      || !can_understand && isLiveAnswerNotBooked 
      || !can_understand && isLiveAnswerLeadNotBooked
      || !can_understand && isConfirmedAppointment 
      || !can_understand && isCancel 
      || !can_understand && isInfoRequest
      || !can_understand && isReschedule 
      || !can_understand && isRescheduleCancelConfirm
      || !can_understand && isVendor
      || !can_understand && isOthers
      ? "required" : "",
      blank_field: 
      !can_understand && isLiveAnswerNoLead 
      || !can_understand && isLiveAnswerLead 
      || !can_understand && isVoiceMailOnly ? 
      "required" : "",
    };

    // if (isNoAnswerHangup) {
    //   Object.keys(r).forEach((key: String) => {
    //     // @ts-ignore
    //     r[key] = "";
    //   });
    // }

    return r;
  },
};
