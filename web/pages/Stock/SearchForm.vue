<template>
    <div class="search-form">
        <StockInput :value="inputSymbol" @update:value="onSelectSearch"/>
        <NButton size="large" @click="onClickSearch">搜索</NButton>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { useStockStore } from '@/store/stock.js'
import { useWatchStore } from '@/store/watch.js'
import StockInput from '../../common/StockInput.vue'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()
const watchStore = useWatchStore()

const inputSymbol = ref(route.query.symbol ?? '')

function updateQuerySymbol(symbol) {
    if (route.query.symbol !== symbol) {
        router.push({
            query: {
                symbol,
            }
        })
    }
}

async function searchSymbol() {
    await stockStore.onSearch()
    await watchStore.onSearch()
}

async function onSelectSearch(ev) {
    inputSymbol.value = ev
    updateQuerySymbol(inputSymbol.value)
    stockStore.symbol = inputSymbol.value
    await searchSymbol()
}

async function onClickSearch() {
    updateQuerySymbol(inputSymbol.value)
    stockStore.symbol = inputSymbol.value
    await searchSymbol()
}

onMounted(async () => {
    if (route.query.symbol) {
        inputSymbol.value = route.query.symbol
        stockStore.symbol = route.query.symbol
        await searchSymbol()
    }
})
</script>

<style scoped lang="less">
.search-form {
    margin-top: .5rem;
    display: flex;
    gap: .5rem;
}
</style>