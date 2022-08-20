<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";
import { useStore } from "@/store";
import { VueServer } from "./VueServer.js";
import { onMounted } from "vue";

const store = useStore();
const logout = () => {
  VueServer.logout();
};

onMounted(() => {
  if (localStorage.accessToken) {
    VueServer.get("/cart", true).then((resp) => {
      store.setCartItems(resp.data.cartData);
      store.setItemsCount(resp.data.cartData.length);
      if (!store.userName) {
        store.setUserName(localStorage.getItem("name"));
      }
    });
  }
});
</script>

<template>
  <div class="w-full">
    <div class="bg-sky-600 mt-0">
      <ul
        class="
          flex flex-row
          ml-24
          p-12
          pl-12
          basis-2/12
          text-stone-200
          font-bold
          text-xl
        "
      >
        <router-link :to="'/'">
          <li class="basis-2/12 hover:text-stone-300">Home</li>
        </router-link>
        <router-link :to="'/orderhistory'">
          <li class="basis-2/12 hover:text-stone-300 pl-10 ml-72 whitespace-nowrap">
            Order History
          </li>
        </router-link>
        <router-link :to="'/orders'">
          <li class="basis-2/12 hover:text-stone-300 ml-72">Order</li>
        </router-link>

        <router-link :to="'/cart'">
          <li class="basis-2/12 hover:text-stone-300 pl-10 ml-72 whitespace-nowrap">
            Cart
            <span class="border-2 rounded-full px-2 bg-red-600">{{
              store.cartItemsCount
            }}</span>
          </li>
        </router-link>
        <router-link @click="logout()" v-if="store.userName" :to="'/'">
          <li
            class="
              whitespace-nowrap
              ml-72
              basis-2/12
              hover:text-stone-300
              inline-flex
            "
          >
            {{ store.userName }}&nbsp; &nbsp; &nbsp;
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log Out
          </li>
        </router-link>
        <router-link v-else :to="'/login'">
          <li class="ml-72 basis-2/12 hover:text-stone-300">Log In</li>
        </router-link>
      </ul>
    </div>

    <RouterView />
  </div>
</template>

