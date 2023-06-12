<template>
  <v-card
    light
    :class="{
      'mx-auto procedures procedures-card pb-5': true,
    }"
    :style="{
      background: $store.getters['theme/themeBackgroundCard'],
      height: height,
      overflow: 'hidden',
    }"
    outlined
  >
    <v-card-title class="d-flex">
      <span
        :class="{
          heading: true,
          'disabled-text':
            $store.getters['calls/rules']['procedure_id'] !== 'required',
            'mt-n4': true,
        }"
      >
        Procedures <span style="color: red">{{$store.getters['calls/rules']['procedure_id'] === 'required' ? '*' : ''}}</span>
      </span>
      <v-spacer></v-spacer>
      <v-text-field
        class="search-input mt-n3 mb-n6"
        id="search"
        clearable
        outlined
        dense
        v-model="search"
        label="Search Proceedures"
      ></v-text-field>
    </v-card-title>

    <div class="body">
      <v-card-text class="py-0">
        <ValidationProvider
          name="procedure_id"
          :rules="$store.getters['calls/rules']['procedure_id']"
          v-slot="{ errors, valid }"
        >
          <v-radio-group
            :disabled="
              $store.getters['calls/rules']['procedure_id'] !== 'required'
            "
            v-model="procedure_id"
          >
            <v-row>
              <v-col
                class="radio-column"
                cols="12"
                sm="6"
                md="6"
                lg="6"
                xl="4"
                v-for="(procedure, index) in list"
                :key="index"
              >
                <v-radio
                  :dark="$vuetify.theme.isDark"
                  :value="procedure.id"
                  class="my-1 mt-n1"
                  
                >
                  <span slot="label" class="">
                    {{ procedure.name }}
                    <!-- <label class="extra">
                      {{ procedure.id == 1 ? 'Full Mouth Reconstruction, All-On-6, Fix on 4 or Fix on 6, Full Arch Implant'
                      : procedure.id == 4 ? 'Metal Braces, Traditional Braces, Orthodontics'
                      : procedure.id == 8 ? 'Crowning, Caps'
                      : procedure.id == 9 ? '"Fix Denture In Place", "Secure My Denture", Whole Dental Work At The Bottom, Whole Dental Work At The Top, snap on denture, overdenture'
                      : procedure.id == 10 ? 'Fake Teeth, Set of Teeth, Artificial Teeth, Dental Plate'
                      : procedure.id == 14 ? 'Single Implant, Single Tooth Replacement'
                      : procedure.id == 15 ? 'Clear Aligners, Clear Braces, Invisible Braces'
                      : procedure.id == 18 ? 'Tooth Removal'
                      : procedure.id == 27 ? 'Lumineers, snap on smile'
                      : '' }}</label> -->
                      <label class="extra">
                      {{ procedure.desc }}</label>
                  </span>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </ValidationProvider>
      </v-card-text>
    </div>

    <v-card-text v-if="proceedMarked && proceedMarked.name && proceedMarked.name.toLowerCase() === 'other'" >
      <v-text-field v-model="other_procedure" clearable outlined dense label="Procedure name" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Procedures from "@/utils/procedures.js";

export default Vue.extend({
  mounted() {
    this.procedure_id = null;
  },
  data() {
    return {
      search: "",
      customProcedures: Procedures
    };
  },
  computed: {
    proceedMarked() {
      return (this as any).list.filter(
        (c: any) => c.id === this.currentScoringCall.procedure_id
      )[0];
    },
    height () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 220
          case 'sm': return 400
          case 'md': return 500
          case 'lg': return 600
          case 'xl': return 800
        }
      },
    list() {
      const list = this.$store.getters[`procedures/fetchResData`];
      // const list:any = this.customProcedures;
      const filteredList = list.filter((procedure: any) => {
        return procedure.name != 'Other' && procedure.name != 'Lumineers' && procedure.name != 'Toothache' && procedure.name != 'Tooth Colored Restoration' && procedure.name != 'Bruxism/Grinding'
      });
      if (this.search) {
        return filteredList.filter((c: any) => {
          return c.desc.toLowerCase().includes(this.search.toLowerCase());
        });
      } else return filteredList;
    },
    currentScoringCall() {
      return this.$store.getters["calls/currentScoringCall"];
    },
    procedure_id: {
      get() {
        // @ts-ignore
        return this.currentScoringCall["procedure_id"];
      },
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          procedure_id: val,
        });
      },
    },
    other_procedure: {
      get() {
        // @ts-ignore
        return this.currentScoringCall["other_procedure"];
      },
      set(val) {
        this.$store.commit("calls/setScoreCallInformation", {
          other_procedure: val,
        });
      },
    },
  },
});
</script>

<style lang="scss">
.procedures {
  border-radius: 5px !important;
  border: none !important;
  .body {
    overflow-y: auto;
    height: 78%;
    margin-top: -13px;
  }
  @media (min-width: 1600px) {
    .col-lg-6 {
      flex: 0 0 33.33333%;
      max-width: 33.33333%;
    }
  }
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #eaeaea;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #263238;
  border-radius: 10px;
}
.search-input {
  width: 50px;
}
.heading {
  position: relative;
  top: -12px;
}
.extra { 
    display: none;
}

label:hover .extra {
    display: inline-block;
    background-color: #f2f2f2; 
    color: #0040ff;
}
</style>
