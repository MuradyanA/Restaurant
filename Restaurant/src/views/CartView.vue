<template>
  <div>
    <table class=" ml-2 mt-5">
      <tr class="font-sans border-collapse   ml-2 mt-5 bg-zinc-400 text-zinc-100">
        <th class="p-5">Name</th>
        <th class="p-3">Price for one</th>
        <th class="p-3">Quantity</th>
      </tr>
      <tbody v-if="store.cartList.length > 0">
        <tr v-for="item in store.cartList" :key="item.id" class="border-collapse   ml-2 mt-5 even:bg-zinc-200 odd:bg-zinc-300 odd:text-zinc-600">
          <td class="pl-24 text-lg font-bold">{{ item.name }}</td>
          <td class="pl-6 text-lg font-bold">{{ item.price }} AMD</td>
          <td class="pl-6 text-lg font-bold flex items-center">
              <span class="ml-5"> {{ item.quantity }} </span>
            <div class="flex flex-col">
                <button @click="updateQuantity(item, true)" class="border-2 px-2  rounded-full mx-10 ">+</button>
                <button @click="updateQuantity(item, false)" class="border-2 px-2  rounded-full mx-10 ">-</button>
            </div>


          <button
            @click="remove(item)"
            class="border-2 ml-2 rounded-xl border-amber-700 bg-orange-600 text-white w-20 mt-1 mr-2"
          >
            Remove
          </button>
          </td>
          <!-- <td class="border border-slate-700">{{item.quantity * item.price}}</td> -->
        </tr>
        <tr>
          <td class="font-bold text-xl">Total:</td>
          <td class="font-bold text-xl">{{ store.totalForCartList }} AMD</td>
        </tr>
      </tbody>
      <button
        class="border-2  border-lime-500 bg-green-600 hover:bg-green-700 duration-500 text-white rounded-md w-20 p-1 mt-2 mb-2 ml-14"
      >
      <router-link :to="'/orders'">
        Order
      </router-link>
      </button>
    </table>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import {onMounted} from "vue";
import {VueServer} from '../VueServer.js'
  const store = useStore();
    
    
  
  const updateQuantity = (item, plusMinus)=>{
    let qty;
    if(plusMinus){
      qty=item.quantity+1
    }else{
      if(item.quantity==1){
        return;
      }
      qty=item.quantity-1
    }
    VueServer.put('/cart',{id:item.id, qty},true).then(()=>{
        store.changeQuantity(item, plusMinus);
    })
  }
  const remove = (item)=>{
    VueServer.delete('/cart', {id:item.id}, true).then(()=>{
      store.removeFromCart(item.id)
    })
  }
</script>
