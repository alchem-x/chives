import { config } from 'dotenv'

const { parsed } = config()

export const {
    APP_PORT = 3000,
    RESEND_MAIL,
    SNOWBALL_TOKEN,
    CW_TOKEN, 
    BARK_API,
    DB_TOKEN,
    DB_HOST,
    DB_TABLE_STOCK,
} = parsed
