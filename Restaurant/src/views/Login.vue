<template>
  <div class="flex justify-center">
    <div class="space-y-4 flex flex-col bg-gray-400 p-10 text-cyan-50 mt-10">
      <h4 class="text-2xl">Log In</h4>
      <div class="flex flex-col w-full">
        <label for="email" class="w-96">Email </label>
        <input v-model="formData.email" class="rounded-md p-1 text-gray-600" name="email" type="text" />
         <p v-if="formDataErrors.email" class="text-rose-600 font-semibold">
          {{ formDataErrors.email }}
        </p>
      </div>
      <div class="flex flex-col w-full">
        <label for="pass" class="w-96">Password</label>
        <input v-model="formData.pass" class="rounded-md p-1 text-gray-600" name="pass" type="password" />
        <p v-if="formDataErrors.pass" class="text-rose-600 font-semibold">
          {{ formDataErrors.pass }}
        </p>
      </div>
      <button
        @click="login()"   class="border-2 border-orange-400 w-32 bg-orange-400 rounded-lg p-1"
      >
        Log In
      </button>
      <div>
        Dont have account?
        <router-link :to="'/register'">
          <button class="underline font-semibold">Click here</button>
        </router-link>
        to register.
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from "vue";
import {VueServer} from '../VueServer.js'
import  router from "../router";

const formData = ref({
  email: "",
  pass: "",
});
const formDataErrors = ref({
  email: "",
  pass: "",
});

const login =()=>{
  VueServer.login(formData, formDataErrors).then(()=>router.push({ name: 'home'}));
}
</script>

<style lang="scss" scoped>
</style>