import { TRARDING_TOKEN } from './global.js'

export function auth(req, res, next) {
    const token = req.header('X-Token')
    if (token === TRARDING_TOKEN) {
        next()
    } else {
        res.send(401, 'Unauthorized');
    }
}