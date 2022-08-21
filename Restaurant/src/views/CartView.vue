<template>
  <div>
    <h1 class="font-sans text-5xl ml-16 mt-5 text-gray-600">CART</h1>
    <hr class="mt-5" />
    <table class="ml-5 mt-5">
      <tr class="font-sans border-collapse ml-2 mt-5 bg-zinc-400 text-zinc-100">
        <th class="p-5">Name</th>
        <th class="p-3">Price for one</th>
        <th class="p-3">Quantity</th>
      </tr>
      <hr class="mt-1" />
      <tbody v-if="store.cartList.length > 0">
        <tr
          v-for="item in store.cartList"
          :key="item.id"
          class="
            border-collapse
            ml-2
            mt-5
            even:bg-zinc-200
            odd:bg-zinc-300 odd:text-zinc-600
          "
        >
          <td class="pl-10">{{ item.name }}</td>
          <td class="pl-6">{{ formatter.format(item.price) }}</td>
          <td class="pl-6 flex items-center">
            <span class="ml-5"> {{ item.quantity }} </span>
            <div class="flex flex-col">
              <button
                @click="updateQuantity(item, true)"
                class="px-2 rounded-full mx-10"
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
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                @click="updateQuantity(item, false)"
                class="px-2 rounded-full mx-10"
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
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            <button
              @click="remove(item)"
              class="
                ml-2
                rounded-md
                hover:bg-orange-800
                duration-500
                bg-orange-600
                text-white
                w-20
                mt-1
                mr-2
                p-1
              "
            >
              Remove
            </button>
          </td>
          <!-- <td class="border border-slate-700">{{item.quantity * item.price}}</td> -->
        </tr>
        <tr>
          <td class="font-bold text-xl">
            Total: {{ formatter.format(store.totalForCartList) }}
          </td>
        </tr>
      </tbody>
      <button
        class="
          text-lg
          bg-green-600
          hover:bg-green-800
          duration-500
          text-white
          rounded-md
          w-24
          p-1
          mt-2
          mb-2
        "
      >
        <router-link :to="'/orders'"> Order </router-link>
      </button>
    </table>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { onMounted } from "vue";
import { VueServer } from "../VueServer.js";
import router from "../router";
const store = useStore();
let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "AMD",
});
onMounted(() => {
  if (!localStorage.getItem("name")) {
    router.push({ name: "login" });
  }
});
const updateQuantity = (item, plusMinus) => {
  let qty;
  if (plusMinus) {
    qty = item.quantity + 1;
  } else {
    if (item.quantity == 1) {
      return;
    }
    qty = item.quantity - 1;
  }
  VueServer.put("/cart", { id: item.id, qty }, true).then(() => {
    store.changeQuantity(item, plusMinus);
  });
};
const remove = (item) => {
  VueServer.delete("/cart", { id: item.id }, true).then(() => {
    store.removeFromCart(item.id);
  });
};
</script>
