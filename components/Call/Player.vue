<template>
  <div>
    <v-card
      light
      :class="{
        player: true,
        'dialog-player': isInsideDialog,
      }"
      elevation="0"
      :style="{ 
        background: $store.getters['theme/themeBackground'],}"
    >
      <v-card-text class="download-action">
        <v-spacer></v-spacer>
        <v-btn icon :to="url" target="_blank" download
          ><v-icon light class="download-icon grey--text">
            mdi-download
          </v-icon></v-btn
        >
      </v-card-text>
      <v-card-text class="main-player">
        <div v-if="computedLoadingMp3Failed === false">
          <div ref="waveform"></div>
          <div class="player-action-buttons">
            <v-btn
              :disabled="computedLoadingMp3Failed"
              class="skip-buttons"
              icon
              @click="skip(-10)"
              ><v-icon>mdi-rewind</v-icon></v-btn
            >
            <v-btn
              :loading="loadingMp3"
              :disabled="computedLoadingMp3Failed"
              class="mx-2 play-pause-button mb-2"
              fab
              :dark="!computedLoadingMp3Failed"
              large
              color="blue"
              @click="togglePlay"
            >
              <v-icon dark>
                {{ isPlaying ? " mdi-pause" : " mdi-play" }}
              </v-icon>
            </v-btn>
            <v-btn
              :disabled="computedLoadingMp3Failed"
              class="skip-buttons"
              icon
              @click="skip()"
              ><v-icon>mdi-fast-forward</v-icon></v-btn
            >
          </div>
        </div>

        <v-alert
          v-else
          border="left"
          color="red"
          elevation="10"
          type="error"
          class="mt-3"
        >
          {{ loadingMp3FailedMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="player-footer">
        <v-btn
          @click="$emit('loadCallInfo')"
          class="text-uppercase grey--text text-center mb-0 call-info-el"
          icon
        >
          <v-icon light>mdi-information-outline</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <!-- <v-container fluid v-if="!loadingMp3Failed">
          <v-checkbox v-model="not_understand">
            <template v-slot:label>
              <small>
                I can't understand the language
              </small>
            </template>
          </v-checkbox>
        </v-container> -->
        <!-- <v-radio-group
            v-model="language"
            row
            v-if="!loadingMp3Failed"
          >
            <v-radio label="I can't understand the language" value="spanish">
              <span slot="label"> I can't understand the language </span>
            </v-radio>
          </v-radio-group> -->
        <div v-if="callLanguageIs != 'spanish'">
        <span v-if="!computedLoadingMp3Failed">
          
          <a class="understand-text" @click="toggleUnderstand">{{
            canUnderstandText
          }}</a>

          <!-- <ValidationProvider
            name="person_name"
            v-if="isAlreadyRated === false"
            :rules="$store.getters['calls/rules']['language']"
            v-slot="{ errors, valid }"
          >
            <v-combobox
              :error-messages="errors"
              v-if="currentScoringCall['can_understand'] === 'no'"
              :error="!valid"
              :value="language"
              v-model="language"
              placeholder="Language"
              style="max-width: 120px"
              item-value="code"
              item-text="name"
              :items="languageOptions"
            ></v-combobox>
          </ValidationProvider>
          <span v-else>
            {{ currentScoringLanguage }}
          </span> -->
        </span>
        </div>
        <!-- <v-btn
        text
        rounded
        icon
        v-if="loadingMp3Failed === false"
        @click.stop="$emit('dialog')"
        @click="handelExpandToggle"
      >
        <v-icon v-if="dialog">mdi mdi-arrow-collapse</v-icon>
        <v-icon v-else>mdi mdi-arrow-expand</v-icon>
      </v-btn> -->
      </v-card-actions>
    </v-card>
  </div>
</template>
<script lang="ts">
import { type } from "node:os";
import { resourceUsage } from "node:process";
import Vue from "vue";

const WaveSurfer = require("wavesurfer.js");
import languages from "~/utils/languages";
let timeout: any;

const errors = {
  e404:
    "The audio file is missing form the source server. The call can't be scored.",
  e403:
    "The audio URL from the source server has expired. The call can't be scored.",
};

export default Vue.extend({
  data() {
    return {
      waveform: null,
      isPlaying: false,
      isSendingPing: false,
      loadingMp3: true,
      loadingMp3Failed: false,
      loadingMp3FailedMessage:
        "The source server has an internal problem. Please file a wrike task about it.",
      languageOptions: languages,
      not_understand: '',
      // url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      // url: require("~/assets/example.mp3").default,
      
    };
  },
  props: {
    url: {
      type: String,
      default: "",
    },
    callLanguage: {
      type: String,
      default: "",
    },
    isInsideDialog: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: [String, Number],
      default: "",
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    callLanguageIs(){
      return this.callLanguage
    },
    computedLoadingMp3Failed() {
      return this.$store.getters["calls/loadingMp3Failed"];
    },
    currentScoringLanguage() {
      const find = languages.find(
        // @ts-ignore
        (c) => c.code === this.currentScoringCall.language
      );
      return find && find.name;
    },
    isAlreadyRated() {
      return this.$store.getters["calls/isAlreadyRated"];
    },
    language: {
      get() {
        // @ts-ignore
        return this.currentScoringCall.language;
      },
      set(val: object | string | any) {
        this.$store.commit("calls/setScoreCallInformation", {
          language: 'spanish',
        });
      },
    },
    currentScoringCall() {
      return this.$store.getters["calls/currentScoringCall"];
    },
    canUnderstandText() {
      // @ts-ignore
      return this.currentScoringCall.can_understand === "yes"
        ? "I can't understand the language"
        : "I can understand the language";
    },
  },
  beforeMount() {
    const _this: any = this;
    if (_this.$refs && _this.$refs.waveform) {
      _this.$refs.waveform.innerHTML = "";
    }
  },
  methods: {
    toggleUnderstand() {
      if (this.isAlreadyRated === false) {
        this.$store.commit("calls/setScoreCallInformation", {
          can_understand:
            this.currentScoringCall.can_understand === "yes" ? "no" : "yes",
          language: "",
        });
      }
    },
    skip(n: number = 10) {
      const _this: any = this;
      if (_this.waveform) {
        _this.waveform.skip && _this.waveform.skip(n);
      }
    },
    init() {
      const _this: any = this;
      _this.loadingMp3Failed = false;
      const waveFormInstance = _this.$refs.waveform;
      _this.waveform = WaveSurfer.create({
        container: waveFormInstance,
        waveColor: "#818181",
        progressColor: "#3688a2",
        height: 60,
        hideScrollbar: true,
        minPxPerSec: 1,
        backend: "MediaElement",
        xhr: {
          headers: [
            { key: "accept", value: "*/*" },
            { key: "accept-language", value: "en-US,en;q=0.9" },
          ],
        },
      });

      _this.waveform.load(`${_this.url}`);

      _this.waveform.on("ready", () => {
        _this.loadingMp3 = _this.isPlaying = false;
        _this.loadingMp3Failed = false;
      });

      _this.waveform.on("finish", () => {
        _this.isPlaying = false;
        _this.$axios.get("/ping?fal");
      });

      _this.waveform.on("error", (e: any) => {
        if (e && e.message && e.message.includes("403")) {
          _this.loadingMp3FailedMessage = errors.e403;
        } else if (e && e.message && e.message.includes("404")) {
          _this.loadingMp3FailedMessage = errors.e404;
        }
        _this.loadingMp3 = false;
        _this.loadingMp3Failed = true;
      });

      const times = _this.duration / 120;

      let arr: any = [];
      for (let index = 0; index < times; index++) {
        const timeinto120 = (index + 1) * 120;
        arr.push(new String(timeinto120).toString());
      }

      // @ts-ignore
      _this.waveform.on("audioprocess", (e) => {
        const currenTime = new Number(e).toFixed(0).toString();
        if (arr.includes(currenTime) && _this.isSendingPing === false) {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            _this.$axios.get("/ping?fal");
          }, 500);
        }
      });
    },
    togglePlay() {
      // @ts-ignore
      this.waveform.playPause();
      // @ts-ignore
      this.isPlaying = !this.isPlaying;
    },
    handelExpandToggle() {
      // @ts-ignore
      if (this.isPlaying) {
        // @ts-ignore
        this.waveform.playPause();
        // @ts-ignore
        this.isPlaying = false;
      }
      if (this.$refs.audio) {
        // @ts-ignore
        this.$refs.audio.pause();
      }
    },
    refreshWave() {
      // @ts-ignore
      if (this.waveform) {
        // @ts-ignore
        this.waveform.drawer.containerWidth = this.waveform.drawer.container.clientWidth;
        // @ts-ignore
        this.waveform.drawBuffer();
      }
    },
  },
  watch: {
    isPlaying() {
      (this.$store as any).commit("calls/setIsListeningAudio", this.isPlaying);
    },
    loadingMp3Failed() {
      (this.$store as any).commit(
        "calls/setLoadingMp3Failed",
        this.loadingMp3Failed
      );
    },
  },
  mounted() {
    const _this: any = this;
    if (_this.waveform) {
      _this.waveform.destroy();
    }
    if (_this.url) {
      _this.init();
    } else {
      _this.loadingMp3Failed = true;
      _this.loadingMp3 = false;
      _this.loadingMp3FailedMessage = errors.e404;
    }
    // @ts-ignore
    window.addEventListener("resize", _this.refreshWave);
  },
  beforeDestroy() {
    const _this: any = this;
    if (_this.waveform && _this.waveform.destroy) {
      _this.waveform.destroy();
    }
    _this.waveform = null;
  },
  destroyed() {
    (this as any).waveform = null;
    (this as any).isPlaying = false;
    ((this as any).$store as any).commit("calls/setIsListeningAudio", false);
  },
});
</script>

<style lang="scss" scoped>
.v-card.dialog-player {
  padding-top: 10px !important;
}
.v-card.player {
  height: 250px;
  .call-info-el {
    cursor: pointer;
  }
  .language-understand-toggle {
    cursor: pointer;
  }
  .default-player {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 15px;
  }
  .play-pause-button {
    position: relative;
    top: -5px;
  }
}
.player-action-buttons {
  text-align: center;
  padding-top: 14px;
  .skip-buttons {
    position: relative;
    top: -5px;
  }
}
.download-action {
  height: 40px;
  padding: 7px;
  text-align: right;
  padding-right: 12px;
}
.player-footer {
  height: 32px;
}
.main-player {
  height: 160px;
  overflow: hidden;
}
.understand-text {
  display: inline-block;
  margin-right: 10px;
}
.language-selector {
  input {
    font-size: 14px;
  }
}
</style>
