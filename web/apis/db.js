import { getTokenFromStorage } from '../common/gui.js'

async function getErrorMessage(r) {
    if (r.status === 401) {
        return '未授权的Token'
    } else {
        return await r.text() || r.statusText || r.status
    }
}

export async function getDBData() {
    const token = getTokenFromStorage()
    if (token) {
        const response = await fetch('/api/db', {
            headers: {
                'X-Token': token,
            }
        })
        if (!response.ok) {
            throw new Error(await getErrorMessage(response))
        }
        return await response.json()
    }
}

export async function newWatchItem(item) {
    const response = await fetch('/api/db/watch/new', {
        method: 'POST',
        headers: {
            'X-Token': getTokenFromStorage(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
    if (!response.ok) {
        throw new Error(await getErrorMessage(response))
    }
    return await response.json()
}

export async function updateWatchItem(item) {
    const response = await fetch('/api/db/watch/update', {
        method: 'POST',
        headers: {
            'X-Token': getTokenFromStorage(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
    if (!response.ok) {
        throw new Error(await getErrorMessage(response))
    }
    return await response.json()
}

export async function deleteWatchItem(item) {
    const response = await fetch('/api/db/watch/delete', {
        method: 'POST',
        headers: {
            'X-Token': getTokenFromStorage(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
    if (!response.ok) {
        throw new Error(response.statusText || response.status)
    }
    return await response.json()
}