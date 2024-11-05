<template>
  <div class="stock-container">
    <NPageHeader :on-back="onBack" title="股票" />
    <SearchForm />
    <OptionalStock />
    <div class="stock-info">
      <StockQuote />
      <StockChart />
    </div>
    <div v-if="guiState.token" class="watch-segment">
      <NPageHeader title="盯盘" />
      <WatchListTable />
    </div>
  </div>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { NPageHeader } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { useStockStore } from '@/store/stock.js'
import { useWatchQuery } from '@/common/watchQuery.js'
import StockQuote from './StockQuote.vue'
import StockChart from './StockChart.vue'
import SearchForm from './SearchForm.vue'
import OptionalStock from './OptionalStock.vue'
import WatchListTable from '@/pages/Watch/WatchListTable.vue'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()

const guiState = inject('GUI_STATE')

function onBack() {
  router.push('/')
}

onMounted(async () => {
  if (route.query.symbol) {
    await stockStore.changeSymbol(route.query.symbol)
  } else {
    await stockStore.changeSymbol('')
  }
  await stockStore.pollRealtimeStock()
})

onBeforeUnmount(async () => {
  await stockStore.changeSymbol('')
})

useWatchQuery(stockStore, ['symbol'])
</script>

<style scoped lang="less">
.stock-container {
  padding: 1rem;
  box-sizing: border-box;

  .stock-info {
    display: flex;
    flex-direction: column;
    margin-top: .5rem;
    gap: .5rem;
  }

  .watch-segment {
    margin-top: .5rem;
  }
}
</style>
