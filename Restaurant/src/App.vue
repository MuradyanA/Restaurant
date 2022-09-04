<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useStore } from "@/store";
import { VueServer } from "./VueServer.js";
import { onMounted } from "vue";

const store = useStore();
const logout = () => {
  VueServer.logout();
};
onMounted(() => {
  VueServer.get("/cart", true).then((resp) => {
      store.setCartItems(resp.data.cartData);
      if (!store.userName) {
        store.setUserName(localStorage.getItem("name"));
      }
    });
});

</script>

<template>
  <div class="w-full flex flex-col justify-between h-screen ">
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
          <li
            class="
              basis-2/12
              hover:text-stone-300
              pl-10
              ml-72
              whitespace-nowrap
            "
          >
            Order History
          </li>
        </router-link>
        <router-link :to="'/orders'">
          <li class="basis-2/12 hover:text-stone-300 ml-72">Order</li>
        </router-link>

        <router-link :to="'/cart'">
          <li
            class="
              basis-2/12
              hover:text-stone-300
              pl-10
              ml-72
              whitespace-nowrap
            "
          >
            Cart
            <span class="rounded-full px-2 bg-red-600">{{
              store.CartItemsCount
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
    <footer
      class="
        w-full
        bg-sky-600
        text-white
        h-36
        mt-10
        p-4
        whitespace-nowrap
        flex flex-row
        pb-20
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-c-circle"
        viewBox="0 0 16 16"
      >
        <path
          d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM8.146 4.992c-1.212 0-1.927.92-1.927 2.502v1.06c0 1.571.703 2.462 1.927 2.462.979 0 1.641-.586 1.729-1.418h1.295v.093c-.1 1.448-1.354 2.467-3.03 2.467-2.091 0-3.269-1.336-3.269-3.603V7.482c0-2.261 1.201-3.638 3.27-3.638 1.681 0 2.935 1.054 3.029 2.572v.088H9.875c-.088-.879-.768-1.512-1.729-1.512Z"
        /></svg>&nbsp;&nbsp;&nbsp;
      <span>Cretated by: Armen Muradyan</span>
    </footer>
  </div>
</template>

