<template>
  <div class="flex flex-row">
    <h1 class="font-sans text-5xl mt-5 text-gray-600">{{props.tableName}}</h1>
    <hr class="mt-5" />
    <div class="flex flex-col mt-5">

      <table class="mt-5">
        <thead class="bg-zinc-400 text-zinc-100">
          <tr class="border-b-4 border-white">
            <th :key="header" v-for="header in props.tableHeaders" class="border-slate-600 p-5">{{header}}</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="props.tableRows.length > 0">
            <tr class="
                    cursor-pointer
                    border-collapse
                    ml-2
                    mt-5
                    text-zinc-600
                    even:bg-zinc-200
                    odd:bg-zinc-300
                  " v-for="row in props.tableRows" :key="row[props.idField]" @click="selectRow(row[props.idField])"
              :class="
                row[props.idField] == selectedRowId
                  ? 'even:bg-sky-400 odd:bg-sky-400'
                  : 'bg-zinc-200'
              ">
              <td v-for="(value, key) in row" :key="key" class="pl-2 py-4">
                {{ value }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="pt-40">
    </div>
  </div>
</template>
<style>
.changeBgColor:focus {
  background-color: #4ddbff;
}
</style>
<script setup>
import { useStore } from "@/store";
import { onMounted, ref, reactive, defineComponent } from "vue";

const store = useStore();
const emit = defineEmits(['rowSelected'])
const selectedRowId = ref("")
const props = defineProps({
  tableName: String,
  tableHeaders: String,
  tableRows: Array,
  idField: String,
});


const selectRow = (id) => {
  selectedRowId.value = id
  emit('rowSelected', selectedRowId.value)


};

</script>

