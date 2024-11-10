<template>
    <div class="ma-line-container" v-if="stockStore.kLineData">
        <NTag v-for="(it) of maList" size="small">
            <span :class="it.className">
                {{ it.name }}:{{ it.value }}
            </span>
        </NTag>
    </div>
</template>

<script setup>
import { NTag } from 'naive-ui'
import { computed } from 'vue'
import { useStockStore } from '@/store/stock.js'

const stockStore = useStockStore()

const maList = computed(() => {
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
                const ma = (sum / n)
                r.push({ name: 'MA' + n, value: ma.toFixed(3), className: { red: ma > current, green: ma < current } })
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
    gap: .5rem;

    .red {
        color: #ee2500;
    }

    .green {
        color: #093;
    }
}
</style>