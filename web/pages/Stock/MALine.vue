<template>
    <Transition name="fade">
        <div class="ma-line-container" v-if="showMA">
            <NTag v-for="(it) of itemList" size="small" :bordered="false" :type="it.tagType">
                {{ it.name }}:{{ it.value }}
            </NTag>
        </div>
    </Transition>
</template>

<script setup>
import { NTag } from 'naive-ui'
import { computed } from 'vue'
import { useStockStore } from '#web/store/stock.js'

const stockStore = useStockStore()

const showMA = computed(() => {
    return !!stockStore.kLineData
})

const itemList = computed(() => {
    const current = stockStore.stockCurrentPrice
    const { item = [], column = [] } = stockStore.kLineData
    const r = []
    let sum = 0
    let i = 0
    const closeIndex = column.findIndex((it) => it === 'close')
    while (i < item.length) {
        sum += item[item.length - 1 - i][closeIndex]
        const n = i + 1
        switch (n) {
            case 5:
            case 10:
            case 15:
            case 20:
            case 30:
            case 60:
            case 120:
            case 250:
            case 500:
            case 1000:
            case 1500:
            case 2000:
            case 2500:
                const ma = (sum / n)
                const className = { red: ma > current, green: ma < current }
                const tagType = `${className.red ? 'error' : ''}${className.green ? 'success' : ''}`
                r.push({ name: 'MA' + n, value: ma.toFixed(3), className, tagType })
                break
            default:
                break;
        }
        i++
    }
    return r
})
</script>

<style scoped lang="less">
.ma-line-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: .5rem;
    gap: .25rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>