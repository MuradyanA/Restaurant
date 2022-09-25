<template>
  <div>
    <h1 class="font-sans text-5xl ml-16 mt-5 text-gray-600">ORDER</h1>
    <hr class="mt-5" />
    <div v-if="store.cartList.length > 0" class="flex mt-5 rounded-sm ml-10">
      <div class="flex flex-wrap w-2/4 bg-gray-400 text-cyan-50 p-5">
        <div class="flex flex-row w-full"></div>
        <div class="flex flex-col bg-gray-400 w-3/6 px-5">
          <label>Name: </label
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
          <label>Surname: </label
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

          <label>City: </label
          ><input
            v-model="order.city"
            class="p-2 rounded-md text-zinc-900"
            type="text"
            placeholder="Yerevan"
          />
          <span v-if="orderErrors.city" class="text-rose-600 font-semibold">
            {{ orderErrors.city }}
          </span>
          <label>Street: </label
          ><input
            v-model="order.street"
            class="p-2 rounded-md text-zinc-900"
            type="text"
            placeholder="Sayat-Nova"
          />
          <span v-if="orderErrors.street" class="text-rose-600 font-semibold">
            {{ orderErrors.street }}
          </span>
          <label>Building: </label
          ><input
            v-model="order.building"
            class="p-2 rounded-md text-zinc-900"
            type="text"
            placeholder="20"
          />
          <span v-if="orderErrors.building" class="text-rose-600 font-semibold">
            {{ orderErrors.building }}
          </span>
        </div>
        <div class="flex flex-col bg-gray-400 w-3/6 px-5">
          <label>Appartments: </label
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
          <label>Phone number: </label
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
          <label>Card holder: </label
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
          <label>Card number: </label
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
          <label>CVV: </label
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
        <h2 class="text-xl mt-3 mb-2">Order Details</h2>

        <div class="flex flex-row bg-gray-400 w-full">
          <table>
            <thead class="">
              <span class="text-rose-600 font-semibold">{{
                orderErrors.cart
              }}</span>
              <tr class="mb-2 flex justify-start">
                <th class="px-3 w-28">Food name</th>
                <th class="px-6 w-28">Quantity</th>
                <th class="px-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="flex justify-start"
                v-for="item in store.cartList"
                :key="item.id"
              >
                <td class="px-3 w-28">{{ item.name }}</td>
                <td class="px-6 w-28">{{ item.quantity }}</td>
                <td class="px-3">
                  {{ formatter.format(item.price * item.quantity) }}
                </td>
              </tr>
              <hr class="mt-3" />
              <br />
              <span class="text-xl font-semibold"
                >Total: {{ formatter.format(store.totalForCartList) }}</span
              >
              <p class="font-semibold mt-3">Date and time of deleviry</p>
              <input
                v-model="order.deliveryTime"
                type="datetime-local"
                class="p-2 text-zinc-900 mt-5 rounded-md"
              />
              <br />
              <span
                v-if="orderErrors.deliveryTime"
                class="text-rose-600 font-semibold"
              >
                {{ orderErrors.deliveryTime }}
              </span>
            </tbody>
          </table>
        </div>
        <div class="flex flex-col bg-gray-400 w-full">
          <button
            class="
              border-2 border-orange-400
              w-32
              bg-orange-400
              rounded-lg
              p-1
              text-white
              mt-5
            "
            @click="sendOrder(item)"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-center mt-5" v-else>
      <h2 class="text-orange-500 text-2xl w-auto">{{ orderMessage }} &nbsp;</h2>
      <svg
        v-if="orderMessage == 'Your order has been placed successfully!'"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-7 h-7 text-orange-500 text-2xl mt-1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      </svg>

      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-7 h-7 text-orange-500 text-2xl mt-1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { ref, onMounted } from "vue";
import { VueServer } from "../VueServer.js";
import router from "../router";
import moment from "moment";
const store = useStore();
let orderMessage = ref("Your cart is empty ");
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
  cart: "",
});

let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "AMD",
});

// onMounted(() => {

// });

const sendOrder = () => {
  VueServer.post("/order", order.value, true)
    .then(() => {
      store.emptyCart();
      orderMessage.value = "Your order has been placed successfully!";
    })
    .catch((err) => {
      err.response.data.errors.forEach((elem) => {
        //orderErrors.value[elem.path] = elem.message;
      });
    });
};
</script>