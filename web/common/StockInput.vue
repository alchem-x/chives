<template>
    <NSelect :value="value || null" @update:value="onUpdateValue" placeholder="搜索股票" :options="options"
        :loading="loading" @search="onSuggestDebounced" size="large" :clear-filter-after-select="false" filterable
        clearable remote>
        <template #empty>
            <span>无数据</span>
        </template>
    </NSelect>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { NSelect } from 'naive-ui'
import debounce from 'lodash/debounce.js'
import { message } from '@/common/providers.jsx'
import { getSuggestStock } from '@/apis/snowball.js'

const props = defineProps(['value', 'name'])
const emit = defineEmits(['update:value', 'update:name'])

const options = ref([])
const loading = ref(false)

async function onSuggest(query) {
    try {
        loading.value = true
        const data = await getSuggestStock(query)
        if (Array.isArray(data)) {
            options.value = data.map((it) => {
                return {
                    value: it.code,
                    label: `${it.query}(${it.code})`,
                    name: it.query,
                }
            })
            if (options.value.every((it) => it.value !== query)) {
                options.value.push({
                    value: query,
                    label: query,
                    name: query,
                })
            }
        }
    } catch (err) {
        message.error(err.message)
    } finally {
        loading.value = false
    }
}

const onSuggestDebounced = debounce(onSuggest, 200)

async function onUpdateValue(ev) {
    emit('update:value', ev ?? '')
    emit('update:name', options.value.find((it) => it.value === ev)?.name)
    await onSuggest(ev)
}

onMounted(async () => {
    if (props.value) {
        await onSuggest(props.value)
    }
})
</script>