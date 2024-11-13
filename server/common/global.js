import { config } from 'dotenv'

const { parsed } = config()

export const {
    APP_PORT = 3000,
    CW_TOKEN, 
    RESEND_MAIL,
    SNOWBALL_TOKEN,
    BARK_API,
    // nocodb
    NOCODB_TOKEN,
    NOCODB_HOST,
    NOCODB_TABLE_STOCK,
    // sqlite
    SQLITE_PATH,
} = parsed
