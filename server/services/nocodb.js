import { NOCODB_TOKEN, NOCODB_HOST } from '#server/common/global.js'

export async function getTableData({ offset, limit, tableId }) {
    const params = new URLSearchParams({ offset, limit })
    const r = await fetch(`${NOCODB_HOST}/api/v2/tables/${tableId}/records?${params}`, {
        headers: {
            'xc-token': NOCODB_TOKEN,
        },
    })
    return await r.json()
}

export  async function updateTableData({ list, tableId }) {
    const r = await fetch(`${NOCODB_HOST}/api/v2/tables/${tableId}/records`, {
        method: 'PATCH',
        headers: {
            'xc-token': NOCODB_TOKEN,
            'content-type': 'application/json'
        },
        body: JSON.stringify(list),
    })
    return await r.json()
}