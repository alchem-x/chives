<template>
    <div class="stock-chart-container">
        <NTabs size="large" type="line" :value="stockStore.chartTab" @update:value="stockStore.changeChartTab">
            <NTab name="1d">分时</NTab>
            <NTab name="5d">五日</NTab>
        </NTabs>
        <div class="lw-chart" ref="chartContainer"></div>
    </div>
</template>

<script setup>
import { shallowRef, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { createChart } from 'lightweight-charts'
import { NTabs, NTab } from 'naive-ui'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import { useStockStore } from '@/store/stock.js'

const chartContainer = ref()
const chart = shallowRef()
const stockStore = useStockStore()

function createLWChart() {
    if (stockStore.chartMinuteData) {
        const { items, last_close: lastClose } = stockStore.chartMinuteData
        const timeScale = {
            borderVisible: false,
            // uniformDistribution: true,
        }
        switch (stockStore.chartTab) {
            case '1d':
                Object.assign(timeScale, {
                    tickMarkFormatter: (time) => {
                        return dayjs(time).format('HH:mm')
                    }
                })
                break
            case '5d':
                Object.assign(timeScale, {
                    tickMarkFormatter: (time) => {
                        return dayjs(time).format('MM-DD')
                    }
                })
                break
            default:
        }

        chart.value = createChart(chartContainer.value, {
            crosshair: {
                vertLine: {
                    labelVisible: false,
                },
            },
            timeScale,
            handleScroll: false,
            handleScale: false,
        })
        //
        {
            const lineSeries = chart.value.addLineSeries()
            lineSeries.priceScale().applyOptions({
                borderVisible: false,
            })
            const priceData = items.map((it) => {
                return {
                    time: it.timestamp,
                    value: it.current,
                }
            })
            lineSeries.setData(priceData)
        }
        //
        {
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
                borderVisible: false,
                scaleMargins: {
                    top: 0.7,
                    bottom: 0,
                },
            })
            const volumeData = items.map((it, index) => {
                return {
                    time: it.timestamp,
                    value: it.volume,
                    color: it.current >= (items[index - 1]?.current ?? lastClose) ? '#ee2500' : '#093',
                }
            })
            volumeSeries.setData(volumeData)
        }
        //
        chart.value.timeScale().fitContent()
    }
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

const resetLWChartDebounced = debounce(resetLWChart, 100)

onMounted(() => window.addEventListener('resize', resetLWChartDebounced))
onBeforeUnmount(() => {
    window.addEventListener('resize', resetLWChartDebounced)
    destroyLWChart()
})

watch(() => stockStore.chartMinuteData, (data) => {
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
        margin-top: 1rem;
        box-sizing: border-box;
        overflow: hidden;
        height: 250px;
        direction: ltr;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
}
</style>