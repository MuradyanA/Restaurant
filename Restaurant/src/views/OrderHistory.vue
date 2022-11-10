<template>
  <div class="flex flex-row">
    <div class="w-2/3 ml-5">
      <h1 class="font-sans text-5xl mt-5 text-gray-600">ORDER HISTORY</h1>
      <div class="flex flex-col mt-5">
        <SearchBar @receive="filterOrders" title="Search in Orders" searchInputName="Customer Name" :periodStart="
          moment(Date.now() - 4 * (24 * 3600 * 1000))
            .startOf('date')
            .format('yyyy-MM-DDTHH:mm')
        " :periodEnd="
          moment(Date.now()).endOf('date').format('yyyy-MM-DDTHH:mm')
        " url="/orderhistory/" renderOnMount="1" />
        <div class="flex flex-row space-x-4 w-44 p-2 ml-4 sticky top-10 border-2 rounded-xl">
          <button v-if="additionalButtons" @click="changeStatus('back')" title="back" class="bg-orange-500 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button v-if="additionalButtons" @click="changeStatus('forward')" title="forward" class="bg-green-500 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button @click="changeStatus('cancel')" title="cancel" class="bg-red-500 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <MyTable @row-selected="getDetails"
         tableName="" :tableHeaders="[
          'ID',
          'Full Name',
          'Date of order',
          'Delivery Time',
          'Delivery Address',
          'Phone Number',
          'Status',
        ]" :tableRows="ordersHistory" idField="id" />
      </div>
    </div>
    <div class="pt-40 ">
      <h4 class="font-sans text-2xl ml-5 text-gray-600">ORDER DETAILS</h4>
      <MyTable class="sticky top-0" tableName="" :tableHeaders="[
        'Food Name',
        'Quantity',
        'Price per One',
      ]" :tableRows="details" idField="foodName"/>
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
import { onMounted, ref, reactive, defineComponent, computed } from "vue";
import moment from "moment";
import { VueServer } from "../VueServer.js";
import SearchBar from "@/components/SearchBar.vue";
import MyTable from "@/components/MyTable.vue";

const store = useStore();
const components = defineComponent({ SearchBar, MyTable });
const orders = reactive({ history: [] });
const currentDetails = ref([]);
const details = ref([])
const selectedRowId = ref(0);
const additionalButtons = ref(false);
let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "AMD",
});

const ordersHistory = computed(() => {
  return orders.history.map((el) => {
    let {
      id,
      fullName,
      deliveryAddress,
      phoneNumber,
      status,
      deliveryTime,
      createdAt,
    } = el;
    return {
      id,
      fullName,
      dateOfOrder: moment(new Date(createdAt)).format("DD/MM/YYYY, h:mm a"),
      deliveryTime: moment(new Date(deliveryTime)).format("DD/MM/YYYY, h:mm a"),
      deliveryAddress,
      phoneNumber,
      status,
    };
  });
});

const getDetails = (e) => {
  selectedRowId.value = e
  VueServer.get(`/orderdetails/?orderId=${e}`, true).then((resp)=>{
    details.value = resp.data
  })
}

const setCurrentDetails = (id) => {
  currentDetails.value = orders.history.find((item) => {
    return item.id == id;
  }).Orderdetails;
  selectedRowId.value = id;
};
const changeStatus = (button) => {
  if(selectedRowId.value==0){
    alert("Please select a row in the table")
  }
  VueServer.put("/order", { button, orderId:selectedRowId.value }, true).then(function (response) {
    orders.history.find(function (item) {
      return item.id == selectedRowId.value;
    }).status = response.data.status;
  });
};

const filterOrders = (response) => {
  orders.history = response.data.orderItems;
  additionalButtons.value = response.data.additionalButtons;
};
</script>