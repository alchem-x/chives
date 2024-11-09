import { config } from 'dotenv'

const { parsed } = config()

export const {
    APP_PORT = 3000,
    SNOWBALL_TOKEN,
    CW_TOKEN, 
    BARK_API,
} = parsed
