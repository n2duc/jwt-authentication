import dotenv from 'dotenv'
dotenv.config()
import ejs from 'ejs'
import nodemailer from 'nodemailer'
import path from 'path'

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  })

  const { email, subject, template, data } = options
  const templatePath = path.join(__dirname, '../mails', template)

  const html = await ejs.renderFile(templatePath, data)

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject,
    html
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail