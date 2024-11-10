import { config } from 'dotenv'

const { parsed } = config()

export const {
    APP_PORT = 3000,
    RESEND_MAIL,
    SNOWBALL_TOKEN,
    SNOWBALL_U,
    CW_TOKEN, 
    BARK_API,
} = parsed
