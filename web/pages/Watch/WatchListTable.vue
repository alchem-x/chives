<template>
    <div class="list-table-container">
        <NDataTable :loading="watchStore.dataLoading" :columns="columns" :data="itemList">
            <template #empty>
                <span>无数据</span>
            </template>
        </NDataTable>
    </div>
    <div class="action-container">
        <NButton size="large" @click="onClickNew" type="primary">
            新增
        </NButton>
        <NButton size="large" @click="onRefresh">
            刷新
        </NButton>
    </div>
</template>

<script setup lang="jsx">
import { NButton, NDataTable, NInputNumber, NSelect, NSwitch } from 'naive-ui'
import { isNumber } from 'lodash-es'
import { createUpdateWatchItemModal } from './action.jsx'
import { WATCH_TYPE_OPTIONS, stateSwitchSlots } from './constants.jsx'
import { useWatchStore } from '@/store/watch.js'
import { useStockStore } from '@/store/stock.js'
import { createNewWatchItemModal } from './action.jsx'
import { useRoute } from 'vue-router'
import { computed, inject } from 'vue'
import { message } from '@/common/providers.jsx'
import { getSnowballLink } from '@/common/snowball.js'

const watchStore = useWatchStore()
const stockStore = useStockStore()
const route = useRoute()

function renderEventData(it) {
    async function onChangeType(ev) {
        await watchStore.updateWatchItem({ ...it, type: ev, })
        it.type = ev
        message.success('变更事件类型')
    }
    async function onChangePrice(ev) {
        if (isNumber(it.price)) {
            await watchStore.updateWatchItem({ ...it })
            message.success('更新价格')
        } else {
            await watchStore.onSearch()
        }
    }
    return (
        <div class="td-event">
            <NSelect size="large" vModel:value={it.type} onUpdate:value={onChangeType} options={WATCH_TYPE_OPTIONS} style="width: 100px;" />
            <NInputNumber size="large" vModel:value={it.price} onBlur={onChangePrice} style="width: 104px;" placeholder="输入价格" clearable showButton={false} />
        </div>
    )
}

const columns = [
    {
        title: '股票',
        className: 'column-stock',
        render: (it) => {
            return (
                <>
                    <NButton size="large" text href={getSnowballLink(it.symbol)} tag="a" target="_blank">
                        {it.name} ({it.symbol})
                    </NButton>
                    <div class="td-price">现价: {it.current}</div>
                    {renderEventData(it)}
                </>
            )
        }
    },
    {
        title: '事件',
        className: 'column-event',
        render: renderEventData,
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
        title: '状态',
        render: (it) => {
            async function onChangeStatus(ev) {
                await watchStore.updateWatchItem({ ...it, enabled: ev, })
                it.enabled = ev
                message.success(it.enabled ? '开始盯盘' : '停止盯盘')
            }
            return (
                <>
                    <NSwitch value={it.enabled} onUpdate:value={onChangeStatus} size="large">
                        {stateSwitchSlots}
                    </NSwitch>
                    <NButton class="button-state-action" onClick={() => createUpdateWatchItemModal(it)} size="large">
                        编辑
                    </NButton>
                </>
            )
        },
    },
    {
        title: '操作',
        className: 'column-action',
        render: (it) => {
            return (
                <NButton onClick={() => createUpdateWatchItemModal(it)} size="large">
                    编辑
                </NButton>
            )
        },
    },
]


const guiState = inject('GUI_STATE')

function onClickNew() {
    const item = {
        type: 'UP_TO',
    }
    if (route.name === 'Stock') {
        item.symbol = stockStore.symbol
        item.name = stockStore.stockName
    }
    item.barkAPI = guiState.barkAPI
    createNewWatchItemModal(item)
}


const itemList = computed(() => {
    if (route.name === 'Stock') {
        return watchStore.watchList.filter((it) => it.symbol === stockStore.symbol)
    } else {
        return watchStore.watchList
    }
})

async function onRefresh() {
    await watchStore.onSearch()
    message.success('已刷新')
}
</script>

<style scoped>
.list-table-container {
    box-sizing: border-box;
    container-type: inline-size;
    margin-top: .5rem;

    :deep(.td-event) {
        display: flex;
        gap: .5rem;
        flex-wrap: wrap;
    }

    :deep(.column-stock) {
        .td-event {
            display: none;
        }
    }

    :deep(.button-state-action) {
        display: none;
    }

    :deep(.td-price) {
        color: #666
    }

    @container (max-width: 800px) {
        :deep(.column-stock) {
            .td-event {
                margin-top: .5rem;
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
            margin-top: .5rem;
        }

        :deep(.td-price) {
            display: inline-block;
            margin-left: .5rem;
        }
    }
}


.action-container {
    margin-top: .5rem;
    box-sizing: border-box;
    display: flex;
    gap: .5rem;
}
</style>