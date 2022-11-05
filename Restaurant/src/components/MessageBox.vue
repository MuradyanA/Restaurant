<script setup>
const emit = defineEmits(['approved','canceled'])
const props = defineProps({
    title: String,
    showMessageBox: Boolean,
    message: String
});

</script>
<template>
    <div v-if="showMessageBox"
        class="drop-shadow-2xl fixed top-36 left-1/2 -translate-x-1/2 w-72 h-auto z-50 border-2 bg-zinc-200 border-zinc-300 rounded-md">
        <div class="flex justify-between bg-sky-600 text-white">
            <h3 class="pl-5">{{ props.title }}</h3>
            <button @click="()=>{$emit ('canceled')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <hr>
        <p class="text-center mt-2">{{props.message}}</p>
        <div class="flex justify-between px-20 py-5">
            <button @click="()=>{$emit('approved')}"
                class="bg-green-600 border-2 border-green-600 text-white rounded-md px-2">Yes</button>
            <button @click="()=>{$emit ('canceled')}"
                class="bg-zinc-400 border-2 border-zinc-400 text-white rounded-md px-2">Cancel</button>
        </div>
    </div>
</template>