export const WATCH_TYPE_OPTIONS = [
    { value: 'UP_TO', label: '价格涨到', },
    { value: 'DOWN_TO', label: '价格跌到', },
]

export const stateSwitchSlots = {
    checked: () => <span>监控</span>,
    unchecked: () => <span>已停</span>
}