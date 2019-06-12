
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
    from: 'gopancd@gmail.com',
    subject: 'Thanks for joining in',
    text: `Welcome to app, ${name}. Let me know how you get along with the app`
  }
  sgMail.send(msg)
}

const sendCancellationEmail = (email, name) => {
  const msg = {
    to: email,
    from: 'gopancd@gmail.com',
    subject: 'Sorry to see you go',
    text: `Sorry to se you go , ${name}. `
  }
  sgMail.send(msg)
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}
