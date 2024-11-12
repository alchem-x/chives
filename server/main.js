import { resolve } from 'node:path'
import express, { static as serveStatic } from 'express'
import bodyParser from 'body-parser'
import { APP_PORT } from './common/global.js'
import { hello } from './routers/hello.js'
import { snowball } from './routers/snowball.js'
import { db } from './routers/db.js'
import { startWatchJobs } from './workers/watch.js'
import { startStockJobs } from './workers/stock.js'
import { sql } from './routers/sql.js'

const dirname = import.meta.dirname

function useRouters(app) {
    app.use(hello)
    app.use(snowball)
    app.use(db)
    app.use(sql)
}

function useStatic(app) {
    app.use(serveStatic(resolve(dirname, '..', 'dist')))
    app.use(serveStatic(resolve(dirname, '..', 'public')))
    app.use((_, res) => res.sendFile(resolve(dirname, '..', 'dist', 'index.html')))
}

function startApp(app) {
    app.listen(APP_PORT, () => {
        console.info(`Serving app: http://localhost:${APP_PORT}`)
    })
}

function main() {
    const app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.text({ type: 'text/plain' }))
    useRouters(app)
    useStatic(app)
    startApp(app)
    startWatchJobs()
    startStockJobs()
}

if (process.argv[1] === import.meta.filename) {
    main()
}