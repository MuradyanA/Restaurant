<template>
  <div>
    <!-- <div class="flex justify-center mt-10">
    <div class="border-collapse ml-2 mt-15 flex justify-center">
      <div
          v-if="!message"
          class="
            space-y-2
            flex flex-row
            bg-gray-400
            p-10
            text-cyan-100
            mt-1
            rounded-md
          "
        >




        <div class="flex flex-row justify-center mt-10">
          
        </div>
        <div class="flex flex-col w-6/12">
           

          </div>





          <div class="flex flex-col w-6/12 ml-10">
            
          
          
          di
          
          </div>


          <div class="flex flex-row">
            <hr />
          <div>
            
          </div>
          
        </div>
      </div>
    </div>
    <div class="flex justify-center p-3" v-if="message">
      <p class="flex flex-row bg-green-300 text-stone-500 w-1/3 rounded-md p-5">
        <span class="mx-4">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <span>{{ message }}</span>
      </p>
    </div>
          </div>










 -->
<div class="flex justify-center mt-5 rounded-sm ">
  <div class="flex flex-wrap justify-center w-2/4 border-4 border-zinc-400 bg-zinc-400 p-5">
    <div class="flex flex-row  w-full">
      <h1 class="text-5xl font-bold text-stone-100  w-full mb-5">Order</h1>
    </div>
    <div class="border-4 border-zinc-400 flex flex-col bg-zinc-400 w-3/6">
       <span>Name: </span
            ><input
              v-model="order.firstName"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="John"
            />
            <span
              v-if="orderErrors.firstName"
              class="text-rose-600 font-semibold"
            >
              {{ orderErrors.firstName }}
            </span>
            <span>Surname: </span
            ><input
              v-model="order.secondName"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="Smith"
            />
            <span
              v-if="orderErrors.secondName"
              class="text-rose-600 font-semibold"
            >
              {{ orderErrors.secondName }}
            </span>
          
            <span>City: </span
            ><input
              v-model="order.city"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="Yerevan"
            />
            <span v-if="orderErrors.city" class="text-rose-600 font-semibold">
              {{ orderErrors.city }}
            </span>
            <span>Street: </span
            ><input
              v-model="order.street"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="Sayat-Nova"
            />
            <span v-if="orderErrors.street" class="text-rose-600 font-semibold">
              {{ orderErrors.street }}
            </span>
            <span>Building: </span
            ><input
              v-model="order.building"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="20"
            />
            <span
              v-if="orderErrors.building"
              class="text-rose-600 font-semibold"
            >
              {{ orderErrors.building }}
            </span>
      </div>
    <div class="border-4 border-zinc-400 flex flex-col bg-zinc-400 w-3/6">
      <span>Appartments: </span
            ><input
              v-model="order.appartments"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="No 3"
            />
            <span
              v-if="orderErrors.appartments"
              class="text-rose-600 font-semibold"
            >
              {{ orderErrors.appartments }}
            </span>
            <span>Phone number: </span
            ><input
              v-model="order.phoneNumber"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="+37412345678"
            />
            <span
              v-if="orderErrors.phoneNumber"
              class="text-rose-600 font-semibold"
            >
              {{ orderErrors.phoneNumber }}
            </span>
            <span>Card holder: </span
            ><input
              v-model="order.cardHolder"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="John Smith"
            />
            <span
              v-if="orderErrors.cardHolder"
              class="text-rose-600 font-semibold"
            >
              {{ orderErrors.cardHolder }}
            </span>
            <span>Card number: </span
            ><input
              v-model="order.cardNumber"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="374245455400126"
            />
            <span
              v-if="orderErrors.cardNumber"
              class="text-rose-600 font-semibold"
            >
              {{ orderErrors.cardNumber }}
            </span>
            <span>CVV: </span
            ><input
              v-model="order.cvv"
              class="p-2 rounded-md text-zinc-900"
              type="text"
              placeholder="123"
            />
            <span v-if="orderErrors.cvv" class="text-rose-600 font-semibold">
              {{ orderErrors.cvv }}
            </span>
          <span class="font-bold text-2xl text-red-600">{{
            errorMessage
          }}</span>
    </div>
    <div class="flex flex-row bg-zinc-400 w-full">
      <h2 class="text-xl font-bold">Order Details</h2>
            <table class="table-fixed">
              <thead>
                <tr class="mb-2">
                  <th class="px-3">Food name</th>
                  <th class="px-3">Quantity</th>
                  <th class="px-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in store.cartList" :key="item.id">
                  <td class="px-3">{{ item.name }}</td>
                  <td class="px-3">{{ item.quantity }}</td>
                  <td class="px-3">{{ item.price * item.quantity }}</td>
                </tr>
                <hr class="mt-3">
                <p class="text-xl font-bold mt-3">Date and time of deleviry</p>
                <input
                  v-model="order.deliveryTime"
                  type="datetime-local"
                  class="p-2 text-zinc-900 mt-5 rounded-md"
                />
                <hr class="mt-3" />
              </tbody>
            </table>
    </div>
    <div class="flex flex-col bg-zinc-400 w-full">
      <span class="text-2xl font-semibold">Total: {{ store.totalForCartList }} AMD</span
    >
    <button
      class="rounded-full mt-3 bg-green-600 h-10 w-40"
      @click="sendOrder(item)"
    >
      Purchase
    </button>


    </div>
  </div>
</div>

</div>
</template>

<script setup>
import { useStore } from "@/store";
import { onMounted, ref } from "vue";
import { VueServer } from "../VueServer.js";
import moment from "moment";
const store = useStore();
const message = ref("");
const order = ref({
  firstName: null,
  secondName: null,
  city: null,
  street: null,
  building: null,
  appartments: null,
  phoneNumber: null,
  cardHolder: null,
  cardNumber: null,
  cvv: null,
  deliveryTime: null,
});
const orderErrors = ref({
  firstName: "",
  secondName: "",
  city: "",
  street: "",
  building: "",
  appartments: "",
  phoneNumber: "",
  cardHolder: "",
  cardNumber: "",
  cvv: "",
  deliveryTime: "",
});
const sendOrder = () => {
  // if (order.value.firstName == null) {
  //   orderErrors.value.firstName = "Firstname field is empty";
  // }
  // if (order.value.secondName == null) {
  //   orderErrors.value.secondName = "Secondname field is empty";
  // }
  // if (order.value.city == null) {
  //   orderErrors.value.city = "City field is empty";
  // }
  // if (order.value.street == null) {
  //   orderErrors.value.street = "Street field is empty";
  // }
  // if (order.value.building == null) {
  //   orderErrors.value.building = "Building field is empty";

  // }
  // if (order.value.appartments == null) {
  //   orderErrors.value.appartments = "Appartments field is empty";
  // }
  // if (order.value.phoneNumber == null) {
  //   orderErrors.value.phoneNumber = "Phonenumber field is empty";
  // }
  // if (order.value.cardHolder == null) {
  //   orderErrors.value.cardHolder = "Cardholder field is empty";
  // }if (order.value.cardNumber == null) {
  //   orderErrors.value.cardNumber = "Cardnumber field is empty";
  // }if (order.value.cvv == null) {
  //   orderErrors.value.cvv = "CVV field is empty";
  //   return;
  // }

  VueServer.post("/order", order.value, true)
    .then(() => {
      message.value = "Your order has been placed successfully!";
      store.emptyCart();
    })
    .catch((err) => {

      err.response.data.errors.forEach((elem) => {
        orderErrors.value[elem.path] = elem.message;
      });
    });
};
</script>