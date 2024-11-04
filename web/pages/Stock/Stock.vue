<template>
  <div class="stock-container">
    <NPageHeader :on-back="onBack" title="股票" />
    <SearchForm />
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
import { inject, onMounted, watch } from 'vue'
import { NPageHeader } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { useStockStore } from '@/store/stock.js'
import { useWatchStore } from '@/store/watch.js'
import { useWatchQuery } from '@/common/watchQuery.js'
import StockQuote from './StockQuote.vue'
import StockChart from './StockChart.vue'
import SearchForm from './SearchForm.vue'
import WatchListTable from '@/pages/Watch/WatchListTable.vue'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()
const watchStore = useWatchStore()

const guiState = inject('GUI_STATE')

function onBack() {
  router.push('/')
}

async function searchSymbol() {
  await stockStore.onSearch()
  await watchStore.onSearch()
}

onMounted(async () => {
  if (route.query.chartType) {
    stockStore.chartType = route.query.chartType
  } else {
    stockStore.chartType = '1d'
    stockStore.chartMinuteData = null
  }
  if (route.query.symbol) {
    stockStore.symbol = route.query.symbol
    await searchSymbol()
  } else {
    stockStore.symbol = ''
    stockStore.stockData = null
  }
  await stockStore.pollRealtimeStock()
})

useWatchQuery(stockStore, ['symbol', 'chartType'])
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
