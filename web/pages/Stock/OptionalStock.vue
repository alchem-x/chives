<template>
    <div v-if="stockStore.recentlyStockList.length" class="recently-stock-container">
        <NTag v-for="(it) of stockStore.recentlyStockList" :bordered="false" @click="onSelectStock(it)"
            @close="onDelete(it)" closable>
            {{ it.name }}
        </NTag>
    </div>
</template>

<script setup>
import { NTag } from 'naive-ui'
import { useStockStore } from '#web/store/stock.js'

const stockStore = useStockStore()

async function onSelectStock(ev) {
    await stockStore.changeSymbol(ev.code)
}

function onDelete(ev) {
    stockStore.deleteRencetlyStock(ev.code)
}

</script>

<style scoped lang="less">
.recently-stock-container {
    margin-top: .5rem;
    display: flex;
    gap: .5rem;
    flex-wrap: wrap;
}
</style>