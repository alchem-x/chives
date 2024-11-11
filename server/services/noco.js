import { DB_TOKEN, DB_HOST } from '../common/global.js'

export async function getTableData({ offset, limit, tableId }) {
    const params = new URLSearchParams({ offset, limit })
    const r = await fetch(`${DB_HOST}/api/v2/tables/${tableId}/records?${params}`, {
        headers: {
            'xc-token': DB_TOKEN,
        },
    })
    return await r.json()
}

export  async function updateTableData({ list, tableId }) {
    const r = await fetch(`${DB_HOST}/api/v2/tables/${tableId}/records`, {
        method: 'PATCH',
        headers: {
            'xc-token': DB_TOKEN,
            'content-type': 'application/json'
        },
        body: JSON.stringify(list),
    })
    return await r.json()
}