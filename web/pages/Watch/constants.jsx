import { styleColorGreen, styleColorRed } from "#web/common/price.js"

export const WATCH_TYPE = {
    UP_TO: 'UP_TO',
    DOWN_TO: 'DOWN_TO',
}

export const WATCH_TYPE_OPTIONS = [
    { value: WATCH_TYPE.UP_TO, label: () => <span style={styleColorRed}>价格涨到</span>, },
    { value: WATCH_TYPE.DOWN_TO, label: () => <span style={styleColorGreen}>价格跌到</span>, },
]

export const stateSwitchSlots = {
    checked: () => <span>监控</span>,
    unchecked: () => <span>已停</span>
}
