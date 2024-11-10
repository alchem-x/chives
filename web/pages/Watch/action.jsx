import { defineComponent, ref } from 'vue'
import { NInput, NSelect, NButton, NSwitch, NForm, NFormItem } from 'naive-ui'
import { css } from '@emotion/css'
import { modal, message } from '@/common/providers.jsx'
import { useWatchStore } from '@/store/watch.js'
import StockInput from '@/common/StockInput.vue'
import { WATCH_TYPE_OPTIONS, stateSwitchSlots } from './constants.jsx'

const FooterClassName = css`
  display: flex;
  justify-content: end;
  gap: .5rem;
  position: relative;

  .btn-delete {
    position: absolute;
    left: 0;
  }
`

function createWatchItemForm({ formRef, formState }) {
    const rules = {
        symbol: {
            trigger: ['blur', 'input'],
            message: '输入股票代码',
            required: true,
        },
        type: {
            trigger: ['blur', 'input'],
            message: '输入事件类型',
            required: true,
        },
        name: {
            trigger: ['blur', 'input'],
            message: '输入股票名称',
            required: false,
        },
        value: {
            trigger: ['blur', 'input'],
            message: '输入价格',
            required: true,
        },
        comment: {
            trigger: ['blur', 'input'],
            message: '输入备注',
            required: false,
        },
    }
    return defineComponent({
        setup() {
            return {
                formRef,
                formState,
                rules,
            }
        },
        render({ formState, rules }) {
            return (
                <NForm
                    model={formState}
                    ref="formRef"
                    labelPlacement="left"
                    labelWidth="auto"
                    size="medium"
                    rules={rules}>
                    <NFormItem label="股票代码" path="symbol">
                        <StockInput vModel:value={formState.symbol} vModel:name={formState.name} immediate/>
                    </NFormItem>
                    <NFormItem label="事件类型" path="type" >
                        <NSelect size="large" vModel:value={formState.type} options={WATCH_TYPE_OPTIONS} placeholder={rules.type.message} />
                    </NFormItem>
                    <NFormItem label="目标价格" path="value">
                        <NInput size="large" vModel:value={formState.value} placeholder={rules.value.message} clearable />
                    </NFormItem>
                    <NFormItem label="状态" path="status">
                        <NSwitch vModel:value={formState.enabled} size="large">
                            {stateSwitchSlots}
                        </NSwitch>
                    </NFormItem>
                    <NFormItem label="备注" path="comment">
                        <NInput type="textarea" vModel:value={formState.comment}
                            autosize={{ minRows: 3 }} placeholder={rules.comment.message} clearable />
                    </NFormItem>
                </NForm>
            )
        },
    })
}

export function createNewWatchItemModal(item) {
    let m
    const formRef = ref()
    const formState = ref({
        ...item,
    })
    const WatchItemForm = createWatchItemForm({ formRef, formState })
    const watchStore = useWatchStore()
    async function onSave() {
        try {
            await formRef.value.validate()
            await watchStore.newWatchItem(formState.value)
            message.success('新增成功')
            m.destroy()
        } catch (err) {
            const s = err.flatMap((it) => it).map((it) => `${it.field}: ${it.message}`).join(', ')
            message.error(s)
        }
    }

    m = modal.create({
        title: '设置提醒',
        preset: 'card',
        style: {
            width: '600px',
        },
        content: () => (<WatchItemForm item={item} />),
        footer: () => {
            return (
                <div class={FooterClassName}>
                    <NButton size="large" onClick={() => m.destroy()}>
                        关闭
                    </NButton>
                    <NButton loading={watchStore.saveLoading} onClick={onSave} size="large" type="primary">
                        保存
                    </NButton>
                </div>
            )
        }
    })
}

export function createUpdateWatchItemModal(item) {
    let m
    const formRef = ref()
    const formState = ref({
        ...item,
    })
    const watchStore = useWatchStore()
    async function onSave() {
        try {
            await formRef.value.validate()
            await watchStore.updateWatchItem(formState.value)
            message.success('更新成功')
            m.destroy()
        } catch (err) {
            const s = err.flatMap((it) => it).map((it) => `${it.field}: ${it.message}`).join(', ')
            message.error(s)
        }
    }
    async function onDelete() {
        try {
            await watchStore.deleteWatchItem(item)
            message.success('删除成功')
            m.destroy()
        } catch (err) {
            message.error(s)
        }
    }
    const WatchItemForm = createWatchItemForm({ formRef, formState })
    m = modal.create({
        title: '编辑提醒',
        preset: 'card',
        style: {
            width: '600px',
        },
        content: () => (<WatchItemForm item={item} />),
        footer: () => {
            return (
                <div class={FooterClassName}>
                    <NButton class="btn-delete" loading={watchStore.deleteLoading} size="large" type="error" onClick={onDelete}>
                        删除
                    </NButton>
                    <NButton size="large" onClick={() => m.destroy()}>
                        关闭
                    </NButton>
                    <NButton loading={watchStore.saveLoading} onClick={onSave} size="large" type="primary">
                        保存
                    </NButton>
                </div>
            )
        }
    })
}