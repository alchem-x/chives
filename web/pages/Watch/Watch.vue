<template>
    <div class="watch-container">
        <NPageHeader :on-back="onBack" title="盯盘" />
        <WatchListTable />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { NPageHeader } from 'naive-ui'
import { useWatchStore } from '@/store/watch.js'
import WatchListTable from './WatchListTable.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const watchStore = useWatchStore()

onMounted(async () => {
    await watchStore.onSearch()
})

function onBack() {
    router.back()
}
</script>

<style scoped>
.watch-container {
    box-sizing: border-box;
    min-height: 100vh;
    padding: 1rem;
}
</style>