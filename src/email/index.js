const nodemailer = require('nodemailer')
const ResponseCode = require('./../utils/ResponseCode')
const { emailConfig } = require('./../config')

const transporter = nodemailer.createTransport(emailConfig)

function send (email) {
  return new Promise(resolve => {
    transporter.sendMail(email, function (error, info) {
      if (error) {
        resolve({ code: ResponseCode.CLIENT_ERROR, msg: error })
      }
      resolve({ code: ResponseCode.SUCCESS, msg: info })
    })
  })
}

module.exports = {
  send
}
