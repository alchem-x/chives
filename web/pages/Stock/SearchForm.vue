<template>
    <div class="search-form">
        <StockInput :value="stockStore.symbol" @update:value="onSelectSearch" />
        <NButton @click="onClickSearch">搜索</NButton>
    </div>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { useStockStore } from '#web/store/stock.js'
import StockInput from '#web/common/StockInput.vue'

const stockStore = useStockStore()

async function onSelectSearch(ev) {
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