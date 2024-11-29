<template>
    <div class="list-table-container">
        <NDataTable :loading="watchStore.dataLoading" :columns="columns" :data="itemList" size="small">
            <template #empty>
                <span>无数据</span>
            </template>
        </NDataTable>
    </div>
    <div class="action-container">
        <NButton @click="onClickNew" type="primary">
            新增
        </NButton>
        <NSwitch :value="watchStore.autoRefresh" @update:value="watchStore.changeAutoRefresh">
            <template #checked>刷新</template>
            <template #unchecked>刷新</template>
        </NSwitch>
    </div>
</template>

<script setup lang="jsx">
import { NButton, NDataTable, NInput, NSelect, NSwitch } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeUnmount } from 'vue'
import { createUpdateWatchItemModal } from './action.jsx'
import { WATCH_TYPE_OPTIONS, stateSwitchSlots } from './constants.jsx'
import { useWatchStore } from '#web/store/watch.js'
import { useStockStore } from '#web/store/stock.js'
import { createNewWatchItemModal } from './action.jsx'
import { message } from '#web/common/providers.jsx'
import { getCurrentPriceItem } from '#web/common/price.js'

const watchStore = useWatchStore()
const stockStore = useStockStore()
const route = useRoute()
const router = useRouter()

const EventData = ({ record }) => {
    const onChangeType = async (ev) => {
        await watchStore.updateWatchItem({ ...record, type: ev, })
        record.type = ev
        message.success('变更事件类型')
    }
    const onChangeValue = async () => {
        if (record.value) {
            await watchStore.updateWatchItem({ ...record })
            message.success('更新价格')
        } else {
            await watchStore.onSearch()
        }
    }
    return (
        <div class={['td-event', record.type]}>
            <NSelect size="small" vModel:value={record.type} onUpdate:value={onChangeType} options={WATCH_TYPE_OPTIONS} style="width: 100px;" />
            <NInput size="small" vModel:value={record.value} onBlur={onChangeValue} style="width: 104px;" placeholder="输入价格" clearable />
        </div>
    )
}

const PriceLabel = ({ record, alt = '', wrap }) => {
    const currentPrice = getCurrentPriceItem(record, wrap)
    if (currentPrice.value) {
        return (
            <span style={currentPrice.style}>{currentPrice.value}</span>
        )
    } else {
        return alt
    }
}

const columns = [
    {
        title: '股票',
        className: 'column-stock',
        render: (it) => {
            const gotoStockPage = () => {
                router.push({
                    path: '/stock',
                    query: { symbol: it.symbol },
                })
            }

            return (
                <>
                    <NButton text onClick={gotoStockPage} type="info" >
                        {it.name}({it.symbol})
                    </NButton>
                    <div class="td-value">
                        <PriceLabel record={it} />
                    </div>
                    <EventData record={it} />
                </>
            )
        }
    },
    {
        title: '价格',
        className: 'column-price',
        render: (it) => (
            <PriceLabel record={it} alt="-" />
        ),
    },
    {
        title: '事件',
        className: 'column-event',
        render: (it) => (
            <EventData record={it} />
        ),
    },
    {
        title: '备注',
        className: 'column-comment',
        render: (it) => {
            return (
                <span>{it.comment || '-'}</span>
            )
        }
    },
    {
        title: '监控',
        className: 'column-status',
        render: (it) => {
            async function onChangeStatus(ev) {
                await watchStore.updateWatchItem({ ...it, enabled: ev, })
                it.enabled = ev
                message.success(it.enabled ? '开始盯盘' : '停止盯盘')
            }
            return (
                <div class="td-status">
                    <NSwitch size="small" value={it.enabled} onUpdate:value={onChangeStatus}>
                        {stateSwitchSlots}
                    </NSwitch>
                    <NButton size="small" class="button-state-action" onClick={() => createUpdateWatchItemModal(it)}>
                        编辑
                    </NButton>
                </div>
            )
        },
    },
    {
        title: '操作',
        className: 'column-action',
        render: (it) => {
            return (
                <NButton text onClick={() => createUpdateWatchItemModal(it)}>
                    编辑
                </NButton>
            )
        },
    },
]

function onClickNew() {
    const item = {
        type: 'UP_TO',
    }
    if (route.name === 'Stock') {
        item.symbol = stockStore.symbol
        item.name = stockStore.stockName
    }
    createNewWatchItemModal(item)
}


const itemList = computed(() => {
    if (route.name === 'Stock') {
        return watchStore.watchList.filter((it) => it.symbol === stockStore.symbol)
    } else {
        return watchStore.watchList
    }
})

onBeforeUnmount(() => {
    watchStore.changeAutoRefresh(false)
})

</script>

<style scoped lang="less">
.list-table-container {
    box-sizing: border-box;
    container-type: inline-size;

    :deep(.n-data-table-table) {
        .n-data-table-th {
            padding: 4px 8px;
        }

        .n-data-table-td {
            padding: 2px 8px;
        }
    }

    :deep(.column-comment) {
        text-wrap-mode: nowrap;
    }

    :deep(.td-event) {
        display: flex;

        .n-base-selection__border,
        .n-input__border {
            border: none;
        }
    }

    :deep(.column-stock) {
        .td-event {
            display: none;
        }
    }

    :deep(.button-state-action) {
        display: none;
    }

    :deep(.td-value) {
        display: none;
        color: #666
    }

    :deep(.column-price) {
        white-space-collapse: preserve;
        text-wrap-mode: nowrap;
    }

    @container (max-width: 680px) {

        :deep(.column-stock) {
            .td-event {
                display: flex;
            }
        }

        :deep(.column-event) {
            display: none;
        }

        :deep(.column-comment) {
            display: none;
        }

        :deep(.column-action) {
            display: none;
        }

        :deep(.button-state-action) {
            display: flex;
            margin-top: .25rem;
        }

        :deep(.td-value) {
            display: inline-block;
            margin-left: .5rem;
        }

        :deep(.column-price) {
            display: none;
        }

        :deep(.column-status) {
            .td-status {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        }
    }
}


.action-container {
    margin-top: .5rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: .5rem;
}
</style>