<template>
  <span>
    <v-autocomplete
      ref="autoComplete"
      v-model="inputValue"
      label="Search for a client"
      clearable
      placeholder="Search for a client"
      :items="clientsList"
      :loading="clientsListLoading || loading"
      item-text="name"
      item-value="id"
      :no-data-text="
        clientsListLoading === false && searchInput && searchInput.length > 0
          ? 'No Results found'
          : clientsListLoading
          ? 'Loading'
          : 'Search something'
      "
      :search-input.sync="searchInput"
      @keydown="fetchClients(searchInput)"
      @change="onChange"
      :filter="() => true"
    ></v-autocomplete>
  </span>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  useRouter,
  onBeforeMount,
  watch,
} from "@nuxtjs/composition-api";
import useApi from "~/services/useApi";
import useClientRecords from "~/services/useClientRecords";

let timeout: any;

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number],
      default: "",
    },
  },
  setup(props, { parent, emit }) {
    const router = useRouter();
    const clientsListLoading = ref(false);
    const { clientById } = useClientRecords();
    const searchInput = ref(router.currentRoute.query.client_name);
    const clientsList = ref([]);
    const autoComplete = ref();
    const { get } = useApi();

    const inputValue = ref();

    const fetchClients = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        if (searchInput.value) {
          clientsListLoading.value = true;
          const res = await get(
            `/clients?name=${searchInput.value}&limit=100`,
            {
              withCredentials: true,
            }
          );
          clientsList.value = res.data.data.result;
          clientsListLoading.value = false;
        }
      }, 300);
    };

    watch(
      () => props.value,
      () => {
        if (!props.value) {
          inputValue.value = null;
          searchInput.value = "";
        }
      }
    );

    const getClient = () => {
      clientsListLoading.value = true;
      clientById(router.currentRoute.query.client as string)
        .then((resp) => {
          const client = resp.data.data;
          if (client) {
            inputValue.value = client.id;
            searchInput.value = client.name;
            clientsList.value = [client] as any;
          }
        })
        .finally(() => {
          clientsListLoading.value = false;
        });
    };

    onMounted(() => {
      if (router.currentRoute.query.client) {
        getClient();
      }
    });

    const onChange = () => {
      const client = clientsList.value.find(
        (c: any) => c.id === inputValue.value
      );
      emit("input", inputValue.value);
      emit("change", inputValue.value, client);
    };

    return {
      clientsListLoading,
      searchInput,
      clientsList,
      fetchClients,
      inputValue,
      autoComplete,
      onChange,
    };
  },
});
</script>
