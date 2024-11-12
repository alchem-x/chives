import { CW_TOKEN } from './global.js'

export function auth(req, res, next) {
    const token = req.header('X-Token') ?? req.query.token
    if (token === CW_TOKEN) {
        next()
    } else {
        res.status(401).send('Unauthorized');
    }
}