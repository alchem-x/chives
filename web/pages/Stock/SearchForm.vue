<template>
    <div class="search-form">
        <StockInput :value="stockStore.symbol" @update:value="onSelectSearch" />
        <NButton size="large" @click="onClickSearch">搜索</NButton>
    </div>
</template>

<script setup>
// import { ref, watch } from 'vue'
// import { useRoute } from 'vue-router'
import { NButton } from 'naive-ui'
import { useStockStore } from '@/store/stock.js'
import StockInput from '../../common/StockInput.vue'

// const route = useRoute()
const stockStore = useStockStore()

// const inputSymbol = ref(route.query.symbol ?? '')

// watch(() => stockStore.symbol, (symbol) => {
//     if (inputSymbol.value !== symbol) {
//         inputSymbol.value = symbol
//     }
// })

async function onSelectSearch(ev) {
    // inputSymbol.value = ev
    await stockStore.changeSymbol(ev)
}

async function onClickSearch() {
    await stockStore.changeSymbol(stockStore.symbol)
}
</script>

<style scoped lang="less">
.search-form {
    margin-top: .5rem;
    display: flex;
    gap: .5rem;
}
</style>