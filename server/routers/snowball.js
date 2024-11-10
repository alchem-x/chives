import { Router } from 'express'
import { getStock, getRealtimeStock, getSuggestStock, getChartMinute, getKLine } from '../services/snowball.js'

export const snowball = Router()

snowball.get('/api/snowball/stock', async (req, res) => {
    const { symbol } = req.query
    const r = await getStock(symbol)
    res.header('Cache-Control', 'no-store')
    res.json(r)
})

snowball.get('/api/snowball/realtime-stock', async (req, res) => {
    const { symbol } = req.query
    const r = await getRealtimeStock(symbol)
    res.header('Cache-Control', 'no-store')
    res.json(r)
})

snowball.get('/api/snowball/suggest-stock', async (req, res) => {
    const { q } = req.query
    const r = await getSuggestStock(q)
    res.json(r)
})

snowball.get('/api/snowball/chart/minute', async (req, res) => {
    const { symbol, period, } = req.query
    const r = await getChartMinute({ symbol, period, })
    res.json(r)
})

snowball.get('/api/snowball/chart/kline', async (req, res) => {
    const {  symbol, begin, period, type, count, indicator, } = req.query
    const r = await getKLine({  symbol, begin, period, type, count, indicator })
    res.json(r)
})