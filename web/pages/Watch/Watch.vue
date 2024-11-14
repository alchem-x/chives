<template>
    <div class="watch-container">
        <NPageHeader :on-back="onBack" title="盯盘" />
        <WatchTable />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader } from 'naive-ui'
import { useWatchStore } from '#web/store/watch.js'
import WatchTable from './WatchTable.vue'

const router = useRouter()
const watchStore = useWatchStore()

onMounted(async () => {
    await watchStore.onSearch()
})

function onBack() {
    router.push('/')
}
</script>

<style scoped lang="less">
.watch-container {
    box-sizing: border-box;
    min-height: 100vh;
    padding: 1rem;

    :deep(.list-table-container) {
        margin-top: .5rem;
    }
}
</style>