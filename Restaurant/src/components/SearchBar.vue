<template>
<div class="p-2">
    <div class="flex flex-row">
      <h3 class="text-xl">{{props.title}}</h3>
    </div>
    <div class="flex flex-row align-middle mt-5">
      <label for="name"
        >{{props.searchInputName}}
        <input
          v-model="searchInput"
          class="border-2 p-1 rounded-md"
          name="name"
          type="text"
        />
      </label>
      <label class="ml-5" for="orderPeriodStart"
        >Period
        <input
          v-model="periodStart"
          class="border-2 p-1 rounded-md"
          name="orderPeriodStart"
          type="datetime-local"
          required
        />
      </label>
      <label for="orderPeriodEnd">
        <input
          v-model="periodEnd"
          class="border-2 p-1 rounded-md"
          name="orderPeriodEnd"
          type="datetime-local"
          required
        />
      </label>

      <button
        @click="filter()"
        type="button"
        class="
          bg-sky-500
          border-2 border-sky-500
          text-white
          rounded-md
          flex
          p-2
          ml-3
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Search
      </button>
    </div>
    <p
      v-if="errors"
      class="text-rose-600 font-semibold ml-96"
    >
      {{ errors }}
    </p>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { VueServer } from "../VueServer";
import moment from "moment";

const emit = defineEmits(['receive'])
const props = defineProps({
  title: String,
  searchInputName: String,
  periodStart: String,
  periodEnd: String,
  url: String,
  renderOnMount: Boolean,
});

const errors = ref("")
const searchInput = ref("")
const periodStart = ref(props.periodStart)
const periodEnd = ref(props.periodEnd)


onMounted(() => {
  if(props.renderOnMount){
    filter();
  }
});

const filter = async ()=>{
  let url = props.url + "?";
  if (searchInput.value) {
    url += `name=${searchInput.value}&`;
  }
  if (periodStart.value > periodEnd.value) {
    errors.value =
      "End of the the date must be bigger than the start";
    return;
  }
  url += `start=${moment(periodStart.value).format(
    "yyyy-MM-DDTHH:mm"
  )}&end=${moment(periodEnd.value).format("yyyy-MM-DDTHH:mm")}`;
     VueServer.get(url,true).then((resp)=>{       
       emit('receive', resp)
     })
}
</script>