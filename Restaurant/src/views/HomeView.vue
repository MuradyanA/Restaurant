<script setup>
import FoodCard from "@/components/FoodCard.vue";
import {
  ref,
  watchEffect,
  reactive,
  computed,
  defineComponent,
  onMounted,
} from "vue";
import { useStore } from "@/store";
import { VueServer } from "../VueServer.js";
const store = useStore();
const components = defineComponent({ FoodCard });
let foodList = reactive({ foods: [] });
const userExists = computed(() => {
  if (store.user == "") {
    return false;
  } else {
    return true;
  }
});
watchEffect(() => {
  VueServer.get("/foodcards", userExists.value).then(function (response) {
    foodList.foods = response.data;
  });
});

const updateActiveStatus = (body) => {
  VueServer.put("/foodcards", { ...body }, true).then(() => {
    let fc = foodList.foods.find((element) => element.id == body.id);
    fc.active = !fc.active;
  });
};
const deleteFoodCard = (body) => {
  VueServer.delete("/foodcards", { ...body }, true)
    .then(() => {
      VueServer.get("/foodcards", userExists.value).then(function (response) {
        foodList.foods = response.data;
      });
    })
    .catch((err) => {
      alert(err.response.data.err);
    });
};
</script>

<template>
  <div class="w-full">
    <div class="h-35 border-2 bg-zinc-200">
      <div class="flex justify-center">
        <img class="rounded-full" src="/FoodPictures/logo.jpg" alt="" />
      </div>
    </div>

    <div class="w-9/12 mx-auto">
      <div class="grid grid-cols-4 gap-10 pt-5">
        <FoodCard
          class=""
          v-for="card in foodList.foods"
          :id="card.id"
          :name="card.name"
          :price="card.price"
          :img="card.img"
          :active="card.active"
          :key="card.id"
          @changeActiveStatus="updateActiveStatus"
          @deleteFoodCard="deleteFoodCard"
        />
      </div>
    </div>
    <br />
    <router-link :to="'/addfood'">
      <div class="flex justify-center" v-if="store.role == 'admin'">
        <button
          title="Add New Food"
          class="
            justify-self-center
            border-2 border-black
            text-lg
            hover:bg-green-600 hover:text-white
            duration-500
            text-black
            rounded-md
            p-5
            mt-2
            mb-2
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </router-link>
  </div>
</template>

