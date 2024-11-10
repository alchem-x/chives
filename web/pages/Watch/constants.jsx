export const WATCH_TYPE = {
    UP_TO: 'UP_TO',
    DOWN_TO: 'DOWN_TO',
}

export const WATCH_TYPE_OPTIONS = [
    { value: WATCH_TYPE.UP_TO, label: '价格涨到', },
    { value: WATCH_TYPE.DOWN_TO, label: '价格跌到', },
]

export const stateSwitchSlots = {
    checked: () => <span>监控</span>,
    unchecked: () => <span>已停</span>
}
