<script setup>
import { useStore } from "@/store";
import { onMounted, ref, defineComponent } from "vue";
import { VueServer } from "../VueServer.js";
import MessageBox from "@/components/MessageBox.vue";
import MyTable from "@/components/MyTable.vue";
import SearchBar from "@/components/SearchBar.vue";
import router from "../router";
import moment from "moment";
const store = useStore();
const components = defineComponent({ MessageBox });
const msg = ref("");
const errorMsg = ref("");
const transactionErrorMessage = ref("")
const reminders = ref([])
const selectedRowId = ref(0);
const foodNameLable = ref("")
const transactions = ref([])
const showMessageBox = ref(false)
const formData = ref({
  updateQtyFoodId: "",
  updateQtyQuantity: "",
});
onMounted(() => {
  getReminders()
});

const saveNewQuantity = () => {
  if (formData.updateQtyFoodId !== "" && formData.updateQtyQuantity !== "") {
    VueServer.post("/transaction", formData.value, true).then((resp) => {
      msg.value = "The quantitty has been updated";
    });
  } else {
    errorMsg.value = "Please fill all the fields";
  }
};
const displayFoodName = () => {
  foodNameLable.value = ""
  const rmd = reminders.value.find((el) => {
    return el.id == formData.updateQtyFoodId
  })
  if (rmd) {
    foodNameLable.value = rmd.foodName
  }


}
const getReminders = () => {
  VueServer.get("/reminder", true).then((response) => {
    reminders.value = response.data

  })
}
const transactionsReceived = (resp) => {
  transactions.value = resp.data


}
const deleteTransaction = (resp) => {
  if (selectedRowId.value == 0) {
    alert("Please select a row in the table")
    return
  }
  VueServer.delete("/transaction", { transactionId: selectedRowId.value }, true).then(function (response) {
    let indx = transactions.value.findIndex(item => item.id == selectedRowId.value)
    transactions.value.splice(indx, 1)
  }).catch((err) => {
    transactionErrorMessage.value = err.response.data
  });
}
</script>
<template>
  <div class="flex flex-row">

    <div class="w-auto ml-10">
      <form enctype="multipart/form-data" class="space-y-4 flex flex-col bg-gray-400 p-10 text-cyan-50 mt-10"
        action="/accounting">
        <h2 class="text-2xl">ADDING/UPDATING FOOD QUANTITY</h2>
        <hr />
        <label class="w-96">Food Id </label>
        <div class="flex flex-row">
          <input @change="displayFoodName" v-model="formData.updateQtyFoodId" class="text-gray-600 rounded-md p-1 w-40"
            type="number" /><span class="ml-7">{{ foodNameLable }}</span>
        </div>
        <label class="w-96">Sum (can be positive or negative)</label>
        <input v-model="formData.updateQtyQuantity" class="text-gray-600 rounded-md p-1 w-40" type="number" />
        <button @click.prevent="saveNewQuantity" class="border-2 border-sky-600 w-32 bg-sky-600 rounded-md p-1">
          Save
        </button>
        <p v-if="msg" class="text-green-700 font-semibold">{{ msg }}</p>
        <p v-if="errorMsg" class="text-red-700 font-semibold">{{ errorMsg }}</p>
      </form>
      <h4 class="font-sans text-2xl mt-10 text-gray-600">Reminders</h4>
      <div class="flex flex-row">
        <MyTable @row-selected="
          (id) => {
            selectedRowId = id
          }
        " tableName="" :tableHeaders="[
  'ID',
  'Food Name',
  'Left in Stock',
]" :tableRows="reminders" idField="id" />
      </div>
    </div>
    <MessageBox title="Delete Transaction" :showMessageBox="showMessageBox"
      message="Are you sure to delete the transaction?" @canceled="() => {
        showMessageBox = false
      }" @approved="() => {
  showMessageBox = false
  deleteTransaction()
}" />
    <div class="flex flex-col">
      <h4 class="font-sans text-2xl ml-20 text-gray-600 my-10">Transactions</h4>
      <SearchBar class="ml-20" @receive="transactionsReceived" title="Search in Transactions"
        searchInputName="Food Name" :periodStart="
          moment(Date.now() - 4 * (24 * 3600 * 1000))
            .startOf('date')
            .format('yyyy-MM-DDTHH:mm')
        " :periodEnd="
  moment(Date.now()).endOf('date').format('yyyy-MM-DDTHH:mm')
" url="/accounting/" renderOnMount="1" />
      <button @click="() => { showMessageBox = true }" title="Remove" class="bg-red-500 rounded-full p-2 w-10 ml-20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6 text-white">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
      <p v-if="transactionErrorMessage" class="ml-20 text-red-700 font-semibold">{{ transactionErrorMessage }}</p>

      <MyTable class="ml-20" @row-selected="
        (id) => {
          selectedRowId = id
          transactionErrorMessage = ''
        }
      " tableName="" :tableHeaders="[
        'ID',
        'Food Name',
        'Turn',
        'Operation',
        'Transaction Date',
        'Order ID',
      ]" :tableRows="transactions" idField="id" />
    </div>

  </div>
</template>