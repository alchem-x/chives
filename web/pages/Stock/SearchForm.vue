<template>
    <div class="search-form">
        <StockInput :value="inputSymbol" @update:value="onSelectSearch" />
        <NButton size="large" @click="onClickSearch">搜索</NButton>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton } from 'naive-ui'
import { useStockStore } from '@/store/stock.js'
import { useWatchStore } from '@/store/watch.js'
import StockInput from '../../common/StockInput.vue'

const route = useRoute()
const stockStore = useStockStore()
const watchStore = useWatchStore()

const inputSymbol = ref(route.query.symbol ?? '')

async function searchSymbol() {
    await stockStore.onSearch()
    await watchStore.onSearch()
}

async function onSelectSearch(ev) {
    inputSymbol.value = ev
    stockStore.symbol = inputSymbol.value
    await searchSymbol()
}

async function onClickSearch() {
    stockStore.symbol = inputSymbol.value
    await searchSymbol()
}
</script>

<style scoped lang="less">
.search-form {
    margin-top: .5rem;
    display: flex;
    gap: .5rem;
}
</style>