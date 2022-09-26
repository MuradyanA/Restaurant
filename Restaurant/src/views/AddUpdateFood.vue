<template>
  <div class="flex flex-row">
    <div class="w-auto ml-10">
      <form

        enctype="multipart/form-data"
        action="/foodcards"
        id="formElem"
        class="space-y-4 flex flex-col bg-gray-400 p-10 text-cyan-50 mt-10"
        @submit.prevent="saveFoodCard()"
      >
        <h2 v-if="props.id" class="text-2xl ml-20">UPDATE FOOD CARD</h2>
        <h2 v-else class="text-2xl ml-20">ADD NEW FOOD</h2>
        <hr />
        <h4 class="text-2xl">Details</h4>
        <div class="flex flex-col w-full">
          <label for="email" class="w-96">Food name </label>
          <input
            v-model="formData.newFoodName"
            class="text-gray-600 rounded-md p-1"
            type="text"
          />
        </div>
        <div class="flex flex-col w-full">
          <label for="firstName" class="w-96">Price per one</label>
          <input
            v-model="formData.newFoodPrice"
            class="text-gray-600 rounded-md p-1"
            type="number"
          />
        </div>
        <div class="flex flex-col w-full">
          <label for="secondName" class="w-96">Image</label>
          <input @change="setImage" type="file" accept="image/*" />
        </div>
        <button v-if="props.id" 
        @click="deleteImage"
          class="
            border-2 border-red-500
            w-36
            bg-red-500
            rounded-md
            p-1
            flex flex-row
            text-white
          "
        >
          Delete Image
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 ml-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
        <button class="border-2 border-sky-600 w-32 bg-sky-600 rounded-md p-1">
          Save
        </button>
        <p v-if="msg" class="text-green-700 font-semibold">{{ msg }}</p>
        <p v-if="errorMsg" class="text-red-700 font-semibold">{{ errorMsg }}</p>
        <router-link :to="'/'">
          <button
            type="button"
            class="
              bg-orange-400
              border-2 border-orange-400
              text-white
              rounded-md
              flex flex-row
              p-2
            "
          >
            Back to Home
          </button>
        </router-link>
      </form>
    </div>
    <div class="ml-96 font-bold text-xl bg-white delay-50">
      <div class="grid grid-cols-2 gap-10 grid-rows-1 pt-5">
        <FoodCard
          class="w-50"
          :id="foodCard.id"
          :name="foodCard.name"
          :price="foodCard.price"
          :img="foodCard.img"
          :active="foodCard.active"
          @changeActiveStatus="updateActiveStatus"
          @deleteFoodCard="deleteFoodCard"
          v-if="Object.keys(foodCard).length > 0"
        />
      </div>
    </div>
  </div>
</template>
  <script setup>
import { useStore } from "@/store";
import { onMounted, ref, defineComponent } from "vue";
import { VueServer } from "../VueServer.js";
import router from "../router";
import FoodCard from "@/components/FoodCard.vue";
import { error } from "console";
const components = defineComponent({ FoodCard });
const foodCard = ref({});
const store = useStore();
const msg = ref("");
const errorMsg = ref("");
const props = defineProps({
  id: Number,
});

const formData = ref({
  newFoodName: "",
  newFoodPrice: "",
  newFoodImage: "",
});
const setImage = (e) => {
  formData.value.newFoodImage = e.target.files[0];
};

const updateActiveStatus = (body) => {
  VueServer.put("/foodcards", { ...body }, true).then(() => {
    foodCard.value.active = !foodCard.value.active;
  });
};
const deleteFoodCard = (body) => {
  VueServer.delete("/foodcards", { ...body }, true).then(() => {
    foodCard.value = {};
    router.push({name:"home"})
  });
};
const deleteImage = (body) => {
  VueServer.put(`/foodcards`,{id:props.id, deleteImage:true}, true).then((resp) => {
    foodCard.value = resp.body
  });
};

const saveFoodCard = (e) => {
  let data;
  if(formData.value.newFoodImage){
    data = new FormData();
    data.append("name", formData.value.newFoodName);
    data.append("price", formData.value.newFoodPrice);
    data.append("image",formData.value.newFoodImage);
    if(props.id){
      data.append("id", props.id)
    }
  }else{
    data = {
      name: formData.value.newFoodName,
      price: formData.value.newFoodPrice,
    };
    if(props.id){
      data.id = props.id
    }
  }
  if (formData.value.newFoodName !== "" && formData.value.newFoodPrice !== "") {
    if (props.id) {
      VueServer.put("/foodcards", data, true)
        .then((resp) => {
          msg.value = "The food has been updated";
          foodCard.value = resp.data;
        })
        .catch(() => {});
    } else {
      
      VueServer.post("/foodcards", data, true).then((resp) => {
        msg.value = "The food has been added";
        foodCard.value = resp.data;
      });
    }
  } else {
    errorMsg.value = "Please fill all the fields";
    return;
  }
};
onMounted(() => {
  if (props.id) {
    VueServer.get(`/foodcards/${props.id}`, true).then((res) => {
      foodCard.value = res.data;
      formData.value.newFoodName = res.data.name;
      formData.value.newFoodPrice = res.data.price;
    });
  }
});
</script>