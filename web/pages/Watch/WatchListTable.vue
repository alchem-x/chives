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
        <NSwitch size="large" :value="watchStore.autoRefresh" @update:value="watchStore.changeAutoRefresh">
            <template #checked>
                刷新
            </template>
            <template #unchecked>
                刷新
            </template>
        </NSwitch>
    </div>
</template>

<script setup lang="jsx">
import { NButton, NDataTable, NInput, NSelect, NSwitch } from 'naive-ui'
import { createUpdateWatchItemModal } from './action.jsx'
import { WATCH_TYPE_OPTIONS, stateSwitchSlots } from './constants.jsx'
import { useWatchStore } from '@/store/watch.js'
import { useStockStore } from '@/store/stock.js'
import { createNewWatchItemModal } from './action.jsx'
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeUnmount } from 'vue'
import { message } from '@/common/providers.jsx'

const watchStore = useWatchStore()
const stockStore = useStockStore()
const route = useRoute()
const router = useRouter()

function renderEventData(it) {
    async function onChangeType(ev) {
        await watchStore.updateWatchItem({ ...it, type: ev, })
        it.type = ev
        message.success('变更事件类型')
    }
    async function onChangeValue(ev) {
        if (it.value) {
            await watchStore.updateWatchItem({ ...it })
            message.success('更新价格')
        } else {
            await watchStore.onSearch()
        }
    }
    return (
        <div class="td-event">
            <NSelect size="large" vModel:value={it.type} onUpdate:value={onChangeType} options={WATCH_TYPE_OPTIONS} style="width: 100px;" />
            <NInput size="large" vModel:value={it.value} onBlur={onChangeValue} style="width: 104px;" placeholder="输入价格" clearable />
        </div>
    )
}

const columns = [
    {
        title: '股票',
        className: 'column-stock',
        render: (it) => {

            function gotoStockPage() {
                router.push({
                    path: '/stock',
                    query: { symbol: it.symbol },
                })
            }
            return (
                <>
                    <NButton size="large" text onClick={gotoStockPage}>
                        {it.name} ({it.symbol})
                    </NButton>
                    <div class="td-value">现价: {it.current}</div>
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

    :deep(.td-value) {
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

        :deep(.td-value) {
            display: inline-block;
            margin-left: .5rem;
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