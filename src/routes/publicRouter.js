const express = require('express')
const JexPublicRouter = express.Router()
const JexPublicController = require('./../controller/publicController')

JexPublicRouter.post('/captcha', function (req, res) {
  JexPublicController.getCaptcha({ req, res })
})

JexPublicRouter.post('/captchaVerify', function (req, res) {
  JexPublicController.verifyCaptcha({ req, res })
})

JexPublicRouter.post('/requestPasswordReset', function (req, res) {
  JexPublicController.requestPasswordReset({ req, res })
})

JexPublicRouter.post('/requestEmailCaptcha', function (req, res) {
  JexPublicController.requestEmailCaptcha({ req, res })
})

JexPublicRouter.post('/requestPasswordResetVerify', function (req, res) {
  JexPublicController.requestPasswordResetVerify({ req, res })
})

JexPublicRouter.post('/requestEmailCaptchaVerify', function (req, res) {
  JexPublicController.requestEmailCaptchaVerify({ req, res })
})

module.exports = JexPublicRouter
