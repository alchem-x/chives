import { Resend } from 'resend'
import { RESEND_MAIL } from '../common/global.js'

const resend = new Resend(RESEND_MAIL)

export async function sendMail({ to, subject, html }) {
    const { data, error } = await resend.emails.send({
        from: '韭菜观察 <cw@nano-exp.com>',
        to,
        subject,
        html,
    })
    if (error) {
        throw new Error(error)
    } else {
        return data
    }
}

/*
await sendMail({
    to: ['cbdyzj@gmail.com'],
    subject: 'Subject',
    html: 'HTML content'
})
*/