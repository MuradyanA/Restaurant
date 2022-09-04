<template>
  <div class="flex flex-row">
    <div class="w-2/3 ml-5">
      <h1 class="font-sans text-5xl ml-10 mt-5 text-gray-600">ORDER HISTORY</h1>
      <hr class="mt-5" />
      <div class="flex flex-col mt-5">
        <div class="p-2">
          <div class="flex flex-row">
            <h3 class="text-xl ml-10">Search In Order History</h3>
          </div>
          <div class="flex flex-row align-middle mt-5">
            <label for="name"
              >Customer name
              <input
                v-model="search.name"
                class="border-2 p-1 rounded-md"
                name="name"
                type="text"
              />
            </label>
            <label class="ml-5" for="orderPeriodStart"
              >Orders Period
              <input
                v-model="search.start"
                class="border-2 p-1 rounded-md"
                name="orderPeriodStart"
                type="datetime-local"
                required
              />
            </label>
            <label for="orderPeriodEnd">
              <input
                v-model="search.end"
                class="border-2 p-1 rounded-md"
                name="orderPeriodEnd"
                type="datetime-local"
                required
              />
            </label>

            <button
              @click="filterOrders()"
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
            v-if="searchDateErrors.dateErr"
            class="text-rose-600 font-semibold ml-96"
          >
            {{ searchDateErrors.dateErr }}
          </p>
        </div>
        <table class="ml-2 mt-5">
          <thead class="bg-zinc-400 text-zinc-100">
            <tr class="border-b-4 border-white">
              <th class="border-slate-600 p-5">Full Name<br /></th>
              <th class="border-slate-600 p-5">Date of order</th>
              <th class="border-slate-600 p-5">Delivery Time</th>
              <th class="border-slate-600 p-5">Delivery Address</th>
              <th class="border-slate-600 p-5">Phone Number</th>
              <th class="border-slate-600 p-5">Status</th>
              <th class="border-slate-600 p-5"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="orders.history.length > 0">
              <tr
                class="
                  cursor-pointer
                  border-collapse
                  ml-2
                  mt-5
                  text-zinc-600
                  even:bg-zinc-200
                  odd:bg-zinc-300
                "
                v-for="item in orders.history"
                :key="item.id"
                @click="setCurrentDetails(item.id)"
                :class="item.id == selectedRowId ? 'even:bg-sky-400 odd:bg-sky-400' : 'bg-zinc-200'"
              >
                <td class="pl-2">
                  {{ item.firstName + " " + item.secondName }}
                </td>
                <td>
                  {{ moment(item.createdAt).format("DD/MM/YYYY, h:mm a") }}
                </td>
                <td>
                  {{ moment(item.deliveryTime).format("DD/MM/YYYY, h:mm a") }}
                </td>
                <td class="pl-2">
                  {{
                    item.city +
                    "/" +
                    item.street +
                    "/" +
                    item.building +
                    "/" +
                    item.appartments
                  }}
                </td>
                <td class="pl-2">{{ item.phoneNumber }}</td>
                <td class="pl-2">{{ item.status }}</td>
                <td
                  class="w-28 flex justify-between px-2 align-middle h-14 pl-2"
                >
                  <button
                    v-if="additionalButtons == true"
                    @click="changeStatus('back', item.id)"
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
                        d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                      />
                    </svg>
                  </button>
                  <button
                    v-if="additionalButtons == true"
                    @click="changeStatus('forward', item.id)"
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
                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <button
                    v-if="item.status !== 'Canceled'"
                    @click="changeStatus('cancel', item.id)"
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
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="pt-40">
      <h4 class="font-sans text-2xl ml-5 text-gray-600 mb-11">ORDER DETAILS</h4>
      <table class="border-1 border-zinc-200 ml-2 sticky top-0">
        <hr class="mt-1" />
        <thead class="bg-zinc-400 text-zinc-100">
          <tr class="mb-2">
            <th class="px-3 border-slate-600 p-5">Food name</th>
            <th class="px-3 border-slate-600 p-5">Quantity</th>
            <th class="px-3 border-slate-600 p-5">Amount</th>
          </tr>
        </thead>
        <tbody class="bg-zinc-200 mt-5">
          <tr
            class="even:bg-zinc-200 odd:bg-zinc-300 odd:text-zinc-600"
            v-for="item in currentDetails"
            :key="item.id"
          >
            <td class="px-3 border-slate-600 p-5">{{ item.foodName }}</td>
            <td class="px-3 border-slate-600 p-5">{{ item.quantity }}</td>
            <td class="px-3 border-slate-600 p-5">
              {{ item.price * item.quantity }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style>
.changeBgColor:focus {
  background-color: #4ddbff;
}
</style>
<script setup>
import { useStore } from "@/store";
import { onMounted, ref, reactive } from "vue";
import moment from "moment";
import { VueServer } from "../VueServer.js";

const store = useStore();
const orders = reactive({ history: [] });
const currentDetails = ref([]);
const selectedRowId = ref(0);
const additionalButtons = ref(false);
const search = ref({
  name: "",
  start: "",
  end: "",
});
const searchDateErrors = ref({
  dateErr: "",
});
const setCurrentDetails = (id) => {
  currentDetails.value = orders.history.find((item) => {
    return item.id == id;
  }).Orderdetails;
  selectedRowId.value = id;
};
onMounted(() => {
  search.value.start = moment(Date.now() - 3 * (24 * 3600 * 1000)).format(
    "yyyy-MM-DDThh:mm"
  );
  search.value.end = moment(Date.now()).format("yyyy-MM-DDThh:mm");
  filterOrders();
});
const changeStatus = (button, orderId) => {
  VueServer.put("/order", { button, orderId }, true).then(function (response) {
    orders.history.find(function (item) {
      return item.id == orderId;
    }).status = response.data.status;
  });
};

const filterOrders = () => {
  let url = "/orderhistory/?";
  if (search.value.name) {
    url += `name=${search.value.name}&`;
  }
  if (search.value.start > search.value.end) {
    searchDateErrors.value.dateErr =
      "End of the the date must be bigger than the start";
    return;
  }
  url += `start=${moment(search.value.start).format(
    "yyyy-MM-DDThh:mm"
  )}&end=${moment(search.value.end).format("yyyy-MM-DDThh:mm")}`;
  VueServer.get(url, true).then(function (response) {
    orders.history = response.data.orderItems;
    additionalButtons.value = response.data.additionalButtons;
  });
};
</script>