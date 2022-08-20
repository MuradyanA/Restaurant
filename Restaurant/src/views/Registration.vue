<template>
  <div class="flex justify-center">
    <form
      @submit.prevent="Register"
      class="space-y-4 flex flex-col bg-gray-400 p-10 text-cyan-50 mt-10"
    >
      <h4 class="text-2xl">Registartion</h4>
      <div class="flex flex-col w-full">
        <label for="email" class="w-96">Email </label>
        <input
          class="text-gray-600 rounded-md p-1"
          v-model="formData.email"
          name="email"
          type="text"
        />
        <p v-if="formDataErrors.email" class="text-rose-600 font-semibold">
          {{ formDataErrors.email }}
        </p>
      </div>
      <div class="flex flex-col w-full">
        <label for="firstName" class="w-96">First Name </label>
        <input
          class="text-gray-600 rounded-md p-1"
          v-model="formData.firstName"
          name="firstName"
          type="text"
        />
        <p v-if="formDataErrors.firstName" class="text-rose-600 font-semibold">
          {{ formDataErrors.firstName }}
        </p>
      </div>
      <div class="flex flex-col w-full">
        <label for="secondName" class="w-96">Second name </label>
        <input
          class="text-gray-600 rounded-md p-1"
          v-model="formData.secondName"
          name="secondName"
          type="text"
        />
        <p v-if="formDataErrors.secondName" class="text-rose-600 font-semibold">
          {{ formDataErrors.secondName }}
        </p>
      </div>
      <div class="flex flex-col w-full">
        <label for="phoneNum" class="w-96">Phone number </label>
        <input
          placeholder="+374 (10) 99-99-99"
          class="text-gray-600 rounded-md p-1"
          v-model="formData.phoneNum"
          name="phoneNum"
          type="text"
        />
        <p v-if="formDataErrors.phoneNum" class="text-rose-600 font-semibold">
          {{ formDataErrors.phoneNum }}
        </p>
      </div>
      <div class="flex flex-col w-full">
        <label for="pass" class="w-96">Password</label>
        <input
          class="text-gray-600 rounded-md p-1"
          v-model="formData.pass"
          name="pass"
          type="password"
        />
        <p v-if="formDataErrors.pass" class="text-rose-600 font-semibold">
          {{ formDataErrors.pass }}
        </p>
      </div>
      <div class="flex flex-col w-full">
        <label for="confirmPass" class="w-96">Confirm password</label>
        <input
          class="text-gray-600 rounded-md p-1"
          v-model="formData.confirmPass"
          name="confirmPass"
          type="password"
        />
        <p
          v-if="formDataErrors.confirmPass"
          class="text-rose-600 font-semibold"
        >
          {{ formDataErrors.confirmPass }}
        </p>
      </div>
      <button
        @click.prevent="register"
        class="border-2 border-orange-400 w-32 bg-orange-400 rounded-lg p-1"
      >
        Register
      </button>
      <p
        v-if="showMessage"
        class="flex flex-row text-[#69f542] font-bold"
        :class="showMessage.value ? 'hidden' : ''"
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg>&nbsp;&nbsp;You have successfully registered
      </p>
      <div>
        Already have an account?
        <router-link :to="'/login'">
          <button class="underline font-semibold">Click here</button>
        </router-link>
        to login.
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";

const showMessage = ref(false);

const formData = ref({
  email: "",
  firstName: "",
  secondName: "",
  pass: "",
  confirmPass: "",
  phoneNum: "",
});
const formDataErrors = ref({
  email: "",
  firstName: "",
  secondName: "",
  pass: "",
  confirmPass: "",
  phoneNum: "",
});
const register = () => {
  formDataErrors.value.email = "";
  formDataErrors.value.firstName = "";
  formDataErrors.value.secondName = "";
  formDataErrors.value.pass = "";
  formDataErrors.value.confirmPass = "";
  formDataErrors.value.phoneNum = "";
  if (formData.value.email == "") {
    formDataErrors.value.email = "Email field is empty";
  }
  if (formData.value.firstName == "") {
    formDataErrors.value.firstName = "Firstname field is empty";
    
  }
  if (formData.value.secondName == "") {
    formDataErrors.value.secondName = "Secondname field is empty";
    
  }
  if (formData.value.pass == "") {
    formDataErrors.value.pass = "Password field is empty";
    
  }
  if (formData.value.confirmPass == "") {
    formDataErrors.value.confirmPass = "Confirm password field must be filled";
    return;
  }
  if (formData.value.pass !== formData.value.confirmPass) {
    formDataErrors.value.pass = "Passwords doesn't match";
    formDataErrors.value.confirmPass = "Passwords doesn't match";
    return;
  }
  const { email, firstName, secondName, pass, phoneNum } = formData.value;
  axios
    .post("/register", { email, firstName, secondName, pass, phoneNum })
    .then(() => {
      showMessage.value = true;
      formData.value.email = "";
      formData.value.firstName = "";
      formData.value.secondName = "";
      formData.value.pass = "";
      formData.value.confirmPass = "";
      formData.value.phoneNum = "";
    })
    .catch((err) => {
      err.response.data.errors.forEach((element) => {
        formDataErrors[element.path].value += " " + element.message;
      });
    });
};
</script>

<style lang="scss" scoped>
</style>