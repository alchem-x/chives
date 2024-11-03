<template>
    <div class="stock-chart-container">
        <div class="lw-chart" ref="chartContainer"></div>
        <div class="action-line">
            <NButton @click="resetLWChart">重置</NButton>
        </div>
    </div>
</template>

<script setup>
import { shallowRef, ref, watch } from 'vue';
import { createChart } from 'lightweight-charts'
import { NButton } from 'naive-ui'
import dayjs from 'dayjs';
import { useStockStore } from '@/store/stock.js'

const chartContainer = ref()
const chart = shallowRef()
const stockStore = useStockStore()

function createLWChart() {
    chart.value = createChart(chartContainer.value, {
        crosshair: {
            vertLine: {
                labelVisible: false,
            },
        },
        timeScale: {
            tickMarkFormatter: (time) => {
                return dayjs(time).format('HH:mm')
            },
        },
    })
    //
    const lineSeries = chart.value.addLineSeries()
    const priceData = stockStore.chartMinute1dData.items.map((it) => {
        return {
            time: it.timestamp,
            value: it.current,
        }
    })
    lineSeries.setData(priceData)
    //
    const volumeSeries = chart.value.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
            top: 0.7,
            bottom: 0,
        },
    })
    volumeSeries.priceScale().applyOptions({
        scaleMargins: {
            top: 0.7,
            bottom: 0,
        },
    })
    const volumeData = stockStore.chartMinute1dData.items.map((it) => {
        return {
            time: it.timestamp,
            value: it.volume,
            color: it.chg >= 0 ? '#ee2500' : '#093',
        }
    })
    volumeSeries.setData(volumeData)
    //
    chart.value.timeScale().fitContent()
}

function destroyLWChart() {
    if (chart.value) {
        chart.value.remove()
        chart.value = null
    }
}

function resetLWChart() {
    destroyLWChart()
    createLWChart()
}

watch(() => stockStore.chartMinute1dData, (data) => {
    if (data) {
        resetLWChart()
    }
})
</script>

<style scoped lang="less">
.stock-chart-container {
    box-sizing: border-box;
    border: 1px solid #efeff5;
    border-radius: 3px;
    padding: 12px;
    overflow: hidden;

    .lw-chart {
        box-sizing: border-box;
        overflow: hidden;
        height: 250px;
        direction: ltr;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
}
</style>