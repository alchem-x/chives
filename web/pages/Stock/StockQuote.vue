<template>
    <div class="stock-quote-container">
        <template v-if="stockStore.stockData">
            <div class="item-container">
                <div class="item" v-for="(it) of items">
                    <span class="name">{{ it.name }}:</span>
                    <span class="value" :class="it.className">{{ it.value }}</span>
                </div>
            </div>
            <NCollapse v-if="extraItems" arrow-placement="right">
                <NCollapseItem>
                    <template #header>
                        <span class="title-collapse">更多</span>
                    </template>
                    <template #header-extra>
                        <NFlex size="small">
                            <SnowballLink />
                            <TVLink />
                        </NFlex>
                    </template>
                    <div class="item-container">
                        <div class="item" v-for="(it) of extraItems">
                            <span class="name">{{ it.name }}:</span>
                            <span class="value" :class="it.className">{{ it.value }}</span>
                        </div>
                    </div>
                </NCollapseItem>
            </NCollapse>
        </template>
        <template v-else>
            <LoadingSegment />
        </template>
    </div>
</template>

<script setup lang="jsx">
import { computed } from 'vue'
import { NButton, NFlex, NCollapse, NCollapseItem } from 'naive-ui'
import { isNil } from 'lodash-es'
import { simplifyNumber } from '#web/common/formating.js'
import { useStockStore } from '#web/store/stock.js'
import { getSnowballLink, getTVLink } from '#web/common/external_links.js'
import LoadingSegment from '#web/common/LoadingSegment.vue'
import { getCurrentPriceItem, toFixed2 } from '#web/common/price.js'
import TradingViewIcon from '#web/common/TradingViewIcon.vue'
import SnowballIcon from '#web/common/SnowballIcon.vue'

const stockStore = useStockStore()

const SnowballLink = () => {
    const { quote } = stockStore.stockData
    return (
        <NButton href={getSnowballLink(quote)} target="_blank" quaternary type="info" tag="a">
            {{
                icon: () => <SnowballIcon />,
                default: () => '雪球',
            }}
        </NButton>
    )
}

const TVLink = () => {
    const { quote } = stockStore.stockData
    return (
        <NButton quaternary type="info" tag="a" href={getTVLink(quote)} target="_blank">
            {{
                icon: () => <TradingViewIcon />,
                default: () => 'TradingView',
            }}
        </NButton>
    )
}

const items = computed(() => {
    const { quote, others = {} } = stockStore.stockData
    if (quote) {
        return [
            { name: '价格', ...getCurrentPriceItem(quote) },
            { name: '最高', value: quote.high, className: { red: quote.high > quote.last_close, green: quote.high < quote.last_close } },
            { name: '最低', value: quote.low, className: { red: quote.low > quote.last_close, green: quote.low < quote.last_close } },
            { name: '今开', value: quote.open, className: { red: quote.open > quote.last_close, green: quote.open < quote.last_close } },
            { name: '昨收', value: quote.last_close, },
            { name: '涨停', value: quote.limit_up, className: { red: quote.limit_up > quote.last_close, green: quote.limit_up < quote.last_close } },
            { name: '跌停', value: quote.limit_down, className: { red: quote.limit_down > quote.last_close, green: quote.limit_down < quote.last_close } },
            { name: '量比', value: quote.volume_ratio, className: { red: quote.volume_ratio > 1, green: quote.volume_ratio < 1 } },
            { name: '委比', value: others.pankou_ratio ? others.pankou_ratio + '%' : others.pankou_ratio, className: { red: others.pankou_ratio > 0, green: others.pankou_ratio < 0 } },
            { name: '成交量', value: quote.volume ? simplifyNumber(Math.trunc(quote.volume / 100)) + '手' : null, },
            { name: '成交额', value: simplifyNumber(quote.amount), },
            { name: '换手', value: quote.turnover_rate ? quote.turnover_rate + '%' : null, },
            { name: '振幅', value: quote.amplitude ? quote.amplitude + '%' : null, },
        ].filter((it) => !isNil(it.value))
    } else {
        return {
            items: [
                { name: '异常', value: '数据为空', className: 'red' }
            ],
        }
    }

})

const extraItems = computed(() => {
    const { quote, market = {} } = stockStore.stockData
    if (quote) {
        return [
            { name: '总市值', value: simplifyNumber(quote.market_capital), },
            { name: '市盈率(动)', value: quote.pe_forecast < 0 ? '亏损' : toFixed2(quote.pe_forecast), },
            { name: '市盈率(静)', value: quote.pe_lyr < 0 ? '亏损' : toFixed2(quote.pe_lyr), },
            { name: '市盈率(TTM)', value: quote.pe_ttm < 0 ? '亏损' : toFixed2(quote.pe_ttm), },
            { name: '52周最高', value: toFixed2(quote.low52w) },
            { name: '52周最低', value: toFixed2(quote.high52w) },
            { name: '货币单位', value: quote.currency, },
            { name: '交易所', value: quote.exchange, },
            { name: '监控', value: market.status, },
        ].filter((it) => !isNil(it.value))
    }
})
</script>

<style scoped lang="less">
.stock-quote-container {
    box-sizing: border-box;
    border: 1px solid #efeff5;
    border-radius: 3px;
    padding: 12px;
    position: relative;
    min-height: 150px;
    container-type: inline-size;

    :deep(.stock-name) {
        font-size: 16px;
        color: #111;
    }

    .item-container {
        column-count: 3;

        .item {
            display: flex;
            gap: .25rem;

            :deep(.name) {
                font-size: 16px;
                color: #111;

                >* {
                    font-size: 16px;
                }
            }

            :deep(.value) {
                font-size: 16px;

                &.red {
                    color: #ee2500;
                    font-weight: 500;
                }

                &.green {
                    color: #093;
                    font-weight: 500;
                }

                font-weight: 400;
            }
        }
    }

    @container (max-width: 720px) {
        .item-container {
            column-count: 2;
        }
    }

    @container (max-width: 500px) {
        .item-container {
            column-count: 1;
        }
    }
}

.title-collapse {
    font-size: 16px;
    user-select: none;
}
</style>
