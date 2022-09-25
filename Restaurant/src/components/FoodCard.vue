<script setup>
import { ref, computed } from "vue";
import { useStore } from "@/store";
import { VueServer } from "../VueServer.js";

const props = defineProps({
  id: Number,
  name: String,
  img: String,
  price: Number,
  active: Boolean,
});

const store = useStore();
const qty = ref(1);
const showMessageBox = ref(false)
const styleContainer = computed(() => {
  if (!props.active) {
    return { opacity: 0.3 };
  } else {
    return { opacity: 1 };
  }
});
const addToCart = function () {
  VueServer.post("/cart", { id: props.id, quantity: qty.value }, true).then(
    (response) => {
      store.addToCart({
        id: response.data.id,
        UserId: store.userId,
        name: props.name,
        img: props.img,
        price: props.price,
        quantity: qty.value,
      });
    }
  );
  return { qty, addToCart };
};
const disableEnable = () => {
  VueServer.put("/foodcards", { id: props.id, active: !props.active }, true)
    .then;
};

</script>
<style v-if="store.role == 'admin'">
.container {
  position: relative;
  width: 50%;
}

.image {
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: 0.3s ease;
  backface-visibility: hidden;
}

.middle {
  transition: 0.3s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.container:hover .image {
  opacity: 0.3;
}

.container:hover .middle {
  opacity: 1;
}
</style>
<template>
  <div>
    <div v-if="showMessageBox" class="drop-shadow-2xl fixed top-36 left-1/2 -translate-x-1/2 w-72 h-32 z-50 border-2 bg-zinc-200 border-zinc-300 rounded-md">
      <div class="flex justify-between bg-sky-600 text-white">
        <h3 class="pl-5">Delete Food Card</h3>
        <button @click="()=>{showMessageBox = false}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <hr>
      <p class="text-center mt-2">Are you sure to delete {{props.name}}?</p>
      <div class="flex justify-between px-20 py-5">
        <button @click="()=>{$emit('deleteFoodCard',{id:props.id})}" class="bg-green-600 border-2 border-green-600 text-white rounded-md px-2">Yes</button>
        <button @click="()=>{showMessageBox = false}" class="bg-zinc-400 border-2 border-zinc-400 text-white rounded-md px-2">Cancel</button>
      </div>
    </div>
  <div
    class="
      relative
      container
      h-65
      w-30
      font-bold
      text-xl
      bg-gray-100
      rounded-lg
      delay-50
      drop-shadow-2xl
    "
    :style="styleContainer"
  >
    
    <img :src="img" alt="" class="w-full rounded-t-lg opacity-100 image" />
    <div v-if="store.role == 'admin'">
      <div
        class="
          opacity-0
          middle
          ml-10
          absolute
          top-20
          left-0
          flex flex-col
          border-2 border-zinc-200
          rounded-md
          p-2
        "
      >
        <button
          @click="
            () => {
              $emit('changeActiveStatus', {
                active: !props.active,
                id: props.id,
              });
            }
          "
          title="Disable/Enable"
        >
          <svg
            v-if="props.active"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        </button>
        <router-link :to="`/updatefood/${props.id}`">
        <button title="Edit" class="pt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </router-link>
        <button title="Delete" class="pt-4"
        @click="
            () => {
              showMessageBox=true
            }
          "
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="p-4 text-gray-700">
      <h3>{{ name }}</h3>
      <p class="mb-3">Price: {{ price }} AMD</p>
      <hr class="my-2" />
      <div class="flex justify-around items-center">
        <div>
          <label>Quantity: </label>
          <input v-model="qty" type="number" min="1" class="w-14 rounded" />
        </div>
        <button
          :disabled="!props.active"
          @click="addToCart"
          class="
            py-1
            px-4
            bg-neutral-900
            rounded
            hover:scale-105
            active:bg-lime-600
            transition
            duration-50
            active:scale-125
          "
        >
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
</div>
</template>