<template>
  <div>
    <Player
      v-if="callLoaded"
      :url="callInfo.call_url"
      :callLanguage="callInfo.language"
      :duration="callInfo.call_duration"
      @loadCallInfo="infoModal = true"
      @dialog="dialog = !dialog"
      :dialog="dialog"
    />
    <v-dialog v-model="dialog" max-width="590">
      <Player
        v-if="callLoaded"
        :url="callInfo.call_url"
        :callLanguage="callInfo.language"
        :duration="callInfo.call_duration"
        @loadCallInfo="infoModal = true"
        @dialog="dialog = !dialog"
        :isInsideDialog="true"
        :dialog="dialog"
      />
    </v-dialog>
    <v-dialog v-model="infoModal" max-width="500px">
      <v-card v-if="callInfo">
        <v-card-title class="headline"> Call information </v-card-title>
        <v-btn
          class="info-close"
          large
          text
          rounded
          fab
          @click.stop="infoModal = false"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
        <v-card-text>
          <table>
            <tbody>
              <tr>
                <th style="text-align: left; width: 200px">Caller ID</th>
                <td style="padding: 8px 0;" >
                  <span class="marchex_call_id">{{
                    callInfo["marchex_call_id"]
                  }}</span>
                  <v-btn
                    @click="copy('.marchex_call_id')"
                    depressed
                    icon
                    color="primary"
                    class="ml-5"
                  >
                    <v-icon dark> mdi-content-copy </v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr>
                <th style="text-align: left; width: 200px">Client</th>
                <td style="padding: 8px 0;" >{{ clientName }}</td>
              </tr>
              <tr>
                <th style="text-align: left; width: 200px">Location</th>
                <td style="padding: 8px 0;" >{{ locationName }}</td>
              </tr>
              <tr>
                <th style="text-align: left; width: 200px">Call start</th>
                <td style="padding: 8px 0;" >{{ momentCallStart }}</td>
              </tr>
              <tr>
                <th style="text-align: left; width: 200px">Call End</th>
                <td>{{ momentCallEnd }}</td>
              </tr>
              <tr>
                <th style="text-align: left; width: 200px">Caller Name</th>
                <td style="padding: 8px 0;" >
                  <span>{{ callInfo["caller_name"] }}</span>
                </td>
              </tr>
              <tr>
                <th style="text-align: left; width: 200px">Caller Number</th>
                <td style="padding: 8px 0;" >
                  <span>{{ callInfo["caller_number"] }}</span>
                </td>
              </tr>
              <tr>
                <th style="text-align: left; width: 200px">
                  The call lasted for
                </th>
                <td style="padding: 8px 0;" >{{ callInfo && callInfo.call_duration }} seconds</td>
              </tr>
            </tbody>
          </table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "./Player.vue";
export default Vue.extend({
  data() {
    return {
      radioGroup: 1,
      dialog: false,
      infoModal: false,
      isCopied: false,
    };
  },
  methods: {
    copy(element: string) {
      if ((document as any).selection) {
        // IE
        var range = (document as any).body.createTextRange();
        range.moveToElementText((document as any).querySelector(element));
        range.select();
        document.execCommand("copy");
      } else if ((window as any).getSelection) {
        var range = (document as any).createRange();
        range.selectNode((document as any).querySelector(element));
        (window as any).getSelection().removeAllRanges();
        (window as any).getSelection().addRange(range);
        document.execCommand("copy");
      }
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 5000);
    },
  },
  computed: {
    callLoaded() {
      return Object.keys((this as any).callInfo).length > 0;
    },
    clientName() {
      const callInfo = (this as any).callInfo;
      return callInfo && callInfo["client"] && callInfo["client"]["name"];
    },
    locationName() {
      const callInfo = (this as any).callInfo;
      return callInfo && callInfo["location"] && callInfo["location"]["name"];
    },
    momentCallStart() {
      const _this: any = this;
      return new Date(_this.callInfo["call_start"]).toUTCString();
    },
    momentCallEnd() {
      const _this: any = this;
      return new Date(_this.callInfo["call_end"]).toUTCString();
    },

    callInfo() {
      const obj = this.$store.getters["calls/fetchSingleRes"];
      return obj && obj.data ? obj.data : {};
    },
  },
  components: {
    Player,
  },
});
</script>

<style lang="scss">
.track-audio-player {
  height: 310px;
  overflow-y: scroll;
  border-radius: 5px !important;
  overflow: hidden !important;
  .audio-main {
    margin-top: 5rem;
  }
}
.collapse-btn {
  position: absolute;
  right: 0;
  bottom: 0;
}
.expand-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 100%;
  i {
    color: #1976d2 !important;
  }
}
.badges-list {
  display: inline-flex;
  list-style-type: none;
  li {
    position: relative;
    margin-left: 30px;
    &::before {
      content: "";
      padding: 5px;
      position: absolute;
      top: 5px;
      left: -20px;
      border-radius: 30px;
    }
  }
  .ring {
    &::before {
      background: #ff7612;
    }
  }
  .agent {
    &::before {
      background: #1bb55c;
    }
  }
  .caller {
    &::before {
      background: #ffbb12;
    }
  }
  .silence {
    &::before {
      background: #e6e6e6;
    }
  }
}
.cursor {
  cursor: pointer;
}
.info-close {
  position: absolute;
  border-radius: 100%;
  right: 0;
  top: 0;
}
</style>
