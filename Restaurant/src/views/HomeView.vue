<script setup>
import FoodCard from "@/components/FoodCard.vue";
import { ref, reactive, computed, defineComponent, onMounted } from "vue";
import { useStore } from "@/store";
import {VueServer} from '../VueServer.js'
const store = useStore();
const components = defineComponent({ FoodCard });
const foodList = ref([]);

onMounted(()=>{
    VueServer.get("/foodcards").then(function (response) {
      // handle success
      foodList.value = response.data;
    });
})

function addtoCart(obj) {
  cardList.push(obj);
}
</script>

<template>
  <div class="w-full">
    <div class="h-35 border-2 bg-zinc-200">
      <div class="flex justify-center">
        <img class="rounded-full" src="/FoodPictures/logo.jpg" alt="" />
      </div>
    </div>

    <div class="w-9/12 mx-auto">
      <div class="grid grid-cols-4 gap-10 grid-rows-2 pt-5">
        <FoodCard
          @addedToCart="addtoCart"
          :id="card.id"
          :name="card.name"
          :price="card.price"
          :img="card.img"
          :key="card.id"
          v-for="card in foodList"
        />
      </div>
    </div>
  </div>
</template>

