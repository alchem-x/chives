<template>
  <div class="stock-container">
    <NPageHeader :on-back="onBack" title="股票" />
    <SearchForm />
    <OptionalStock />
    <div class="stock-info">
      <StockQuote />
      <MALine />
      <NCollapse arrow-placement="right">
        <NCollapseItem>
          <template #header>
            <span class="title-collapse">分时</span>
          </template>
          <StockChart />
        </NCollapseItem>
      </NCollapse>
    </div>
    <NCollapse class="watch-section" v-if="guiState.token" arrow-placement="right">
      <NCollapseItem>
        <template #header>
          <span class="title-collapse">盯盘</span>
        </template>
        <WatchTable />
        <NButton class="all-watch" @click="gotoWatchPage" text>全部盯盘</NButton>
      </NCollapseItem>
    </NCollapse>
  </div>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { NPageHeader, NButton, NCollapse, NCollapseItem, NFlex } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { useStockStore } from '#web/store/stock.js'
import { useWatchQuery } from '#web/common/watchQuery.js'
import StockQuote from './StockQuote.vue'
import StockChart from './StockChart.vue'
import SearchForm from './SearchForm.vue'
import OptionalStock from './OptionalStock.vue'
import WatchTable from '#web/pages/Watch/WatchTable.vue'
import MALine from './MALine.vue'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()

const guiState = inject('GUI_STATE')

function onBack() {
  router.push('/')
}

function gotoWatchPage() {
  router.push('/watch')
}

onMounted(async () => {
  if (route.query.symbol) {
    await stockStore.changeSymbol(route.query.symbol)
  } else {
    await stockStore.changeSymbol('')
  }
  stockStore.startCronJobs()
})

onBeforeUnmount(async () => {
  await stockStore.changeSymbol('')
  stockStore.stopCronJobs()
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
}

.title-collapse {
  font-size: 16px;
  user-select: none;
}

.all-watch {
  margin-top: .5rem;
}

.watch-section {
  margin-top: .5rem;
}
</style>
