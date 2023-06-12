<template>
  <v-container fill-height fluid>
    <v-row v-if="showDisplay" align="center" justify="center">
      <v-col cols="12">
        <v-card elevation="0" width="400px">
          <img
            src="~static/Logo_White.jpg"
            class="login-header-image"
            width="100%"
            alt=""
          />
          <v-card-text>
            <div class="text-center">
              <audio ref="audioEl" style="" controls>
                <source :src="link" type="audio/mp3" @error="failedMp3" />
                Your browser does not support the audio tag.
              </audio>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="isFailed"
                    class="skip-buttons"
                    icon
                    @click="skip(-10)"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-rewind</v-icon>
                  </v-btn>
                </template>
                <span> Fast backward 10 seconds </span>
              </v-tooltip>
              <v-btn
                class="mx-2 play-pause-button mb-2"
                fab
                :disabled="isFailed"
                large
                color="blue"
                @click="play"
              >
                <v-icon color="white">
                  {{ isPlaying ? " mdi-pause" : " mdi-play" }}
                </v-icon>
              </v-btn>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="isFailed"
                    class="skip-buttons"
                    icon
                    @click="skip(10)"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-fast-forward</v-icon>
                  </v-btn>
                </template>
                <span> Fast forward 10 seconds </span>
              </v-tooltip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" >
import {
  defineComponent,
  useRoute,
  computed,
  ref,
  onMounted,
} from "@nuxtjs/composition-api";
import axios, { AxiosResponse } from "axios";
import swalMixin, { showToast } from "~/utils/swalMixin";

export default defineComponent({
  layout: "blank",
  head: {
    title: "Call Audio",
  },
  setup(props, { parent }) {
    const audioEl = ref();
    const $swal = swalMixin((parent as any).$swal as any);
    const route = useRoute();
    const axios = parent?.$axios;
    const duration = ref(0);
    const isPlaying = ref(false);
    const isFailed = ref(false);
    const query = computed(() => {
      return route.value.query?.url ? route.value.query?.url : route.value.query?.lead_id
      // return require("~/assets/example.mp3").default
      // return "https://reporting-api.wm4d.com/storage/calls/3719-20210421.mp3"
    });
    const link = ref(
      route.value.query?.url ? route.value.query?.url : route.value.query?.lead_id
    );
    const fetchedUrl = ref()
    const showDisplay = ref(false)

    const failedMp3 = () => {
      showToast($swal, {
        icon: "error",
        title: "The URL has expired.",
      });
      isFailed.value = true;
    };

    const skip = (n: Number) => {
      if (n > 0) audioEl.value.currentTime += n;
      else audioEl.value.currentTime = audioEl.value.currentTime - 10;
    };
    const play = (n: Number) => {
      audioEl.value.crossOrigin = "anonymous";

      if (!isPlaying.value) {
        audioEl.value.play();
        isPlaying.value = true;
      } else {
        audioEl.value.pause();
        isPlaying.value = false;
      }
    };

    const loadCall = () => {
      const message = (resp: AxiosResponse) => {
        console.log(message);
        if (!resp) {
          showToast($swal, {
            icon: "warning",
            title: "Unable to get information about the call, The call maybe still available.",
          });
        }
        const status = resp?.status;
        switch (status) {
          case 409:
            showToast($swal, {
              icon: "error",
              title: "Call is not ready.",
            });
            break;
          case 200:
            showToast($swal, {
              title: "Call ready.",
            });
            break;

          default:
            break;
        }
      };
      if (route.value.query?.lead_id) {
        axios
        ?.get(`/player?lead_id=${query.value}`)
        .then((resp) => {
          // console.log('CALL_URL', resp.data.data.call_url)
          message(resp as AxiosResponse);
          // fetchedUrl.value = resp.data.data.call_url ? resp.data.data.call_url : ''
          link.value = route.value.query?.url ? route.value.query?.url : resp.data.data.call_url
          showDisplay.value = true
          audioEl.value.onpause = () => (isPlaying.value = false);
          audioEl.value.onplay = () => (isPlaying.value = true);
        })
        .catch((resp) => {
          message(resp.response);
        });
      }
      
    };

    onMounted(() => {
      // audioEl.value.onpause = () => (isPlaying.value = false);
      // audioEl.value.onplay = () => (isPlaying.value = true);
      if (route.value.query?.url) {
        showDisplay.value = true
        // audioEl.value.onpause = () => (isPlaying.value = false);
        // audioEl.value.onplay = () => (isPlaying.value = true);
      }
      loadCall();
    });

    return {
      link,
      audioEl,
      failedMp3,
      isFailed,
      axios,
      isPlaying,
      skip,
      duration,
      play,
      fetchedUrl,
      query,
      showDisplay,
    };
  },
});
</script>


<style scoped>
.v-card {
  margin: auto;
  padding: 30px;
}
</style>

<style>
canvas {
  /* width: 100%; */
}
audio {
  margin-bottom: 2em;
}
</style>