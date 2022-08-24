<script setup>
import { ref } from "vue";
import { useStore } from "@/store";
import { VueServer } from "../VueServer.js";

const props = defineProps({
  id: Number,
  name: String,
  img: String,
  price: Number,
});

const store = useStore();
const qty = ref(1);
const addToCart = function () {
  VueServer.post("/cart", { id: props.id, quantity: qty.value }, true).then(
    (response) => {
      store.addToCart({
        id: response.data.id,
        UserId: localStorage.getItem("id"),
        name: props.name,
        img: props.img,
        price: props.price,
        quantity: qty.value,
      });
      store.setItemsCount(response.data.items);
    }
  );
  return { qty, addToCart };
};
</script>

<template>
  <div
    class="
      h-65
      w-30
      font-bold
      text-xl
      bg-gray-100
      rounded-lg
      transition
      ease-in-out
      delay-50
      drop-shadow-2xl
    "
  >
    <img :src="img" alt="" class="w-full rounded-t-lg" />
    <div class="p-4 text-gray-700">
      <h3>{{ name }}</h3>
      <p class="mb-3">Price: {{ price }} AMD</p>
      <hr class="my-2" />
      <div class="flex justify-around items-center">
        <div>
          <label>Quantity: </label>
          <input v-model="qty" type="number" min="1" class="w-14 rounded" />
        </div>
        <button @click="addToCart" class="py-1 px-4 bg-neutral-900 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>