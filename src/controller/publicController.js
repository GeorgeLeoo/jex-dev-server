const svgCaptcha = require('svg-captcha')
const { setValue, getValue, delValue } = require('../utils/redis')
const { captchaOptions } = require('../config')
const Response = require('../utils/Response')
const emailServer = require('./../email')
const passwordRestTemplate = require('../template/passwordRestTemplate')
const verifyCodeEmailTemplate = require('../template/verifyCodeEmailTemplate')
const ResponseCode = require('src/utils/ResponseCode')
const { createPasswordReset } = require('./../db/module/publicDB')

/**
 * 获取验证码
 * @param {*} param0
 */
async function getCaptcha({ req, res }) {
	const { uuid } = req.body
	const captcha = svgCaptcha.create(captchaOptions)
	setValue(uuid, captcha.text.toLowerCase(), 43200)
	const response = new Response({ res })
	response.send({ data: captcha.data })
}

/**
 * 验证验证码
 * @param {*} param0
 */
async function verifyCaptcha({ req, res }) {
	const response = new Response({ res })
	const { uuid, captcha } = req.body
	const data = await getValue(uuid)
	if (data === captcha) {
		delValue(email)
		response.send({ msg: 'ok' })
	} else {
		response.send({ msg: 'no' })
	}
}

/**
 * 重置密码
 * @param {*} param0
 */
async function requestPasswordReset({ req, res }) {
	const response = new Response({ res })
	const { email } = req.body
	// const email = "georgeleeo@163.com"
	// 过期时间 30m
	const expireTime = 30
	const sendInfo = {
		to: email,
		expire: expireTime,
		user: email,
	}
	const result = await createPasswordReset({ to: email, expire: expireTime })
	if (result.code === ResponseCode.SUCCESS) {
		const emailData = passwordRestTemplate(sendInfo)
		const { code, msg, data } = await emailServer.send(emailData)
		response.send({ code, msg, data: result.data })
	} else {
		response.send({ code: result.code, msg: result.msg })
	}
}

/**
 * 验证重置密码
 * @param {*} param0
 */
async function requestPasswordResetVerify({ req, res }) {
  const { _id } = req.body
  const response = new Response({ res })
  const result = await updatePasswordReset(_id)
  // 查询30min到期没有
  // 1. 没有到期
  // 2. 到期
	response.send({ code, msg, data })
}

/**
 * 获取邮箱验证码
 * @param {*} param0
 */
async function requestEmailCaptcha({ req, res }) {
	const { email } = req.body

	const captcha = svgCaptcha.create(captchaOptions)
	const captchaData = captcha.text
	// 过期时间 30m
	const expireTime = 30
	setValue(email, captchaData, expireTime)
	const sendInfo = {
		to: email,
		code: captchaData,
		expire: expireTime,
		user: email,
	}
	const emailData = verifyCodeEmailTemplate(sendInfo)
	const { code, msg, data } = await emailServer.send(emailData)
	const response = new Response({ res })
	response.send({ code, msg, data })
}

/**
 * 验证邮箱验证码
 * @param {*} param0
 */
async function requestEmailCaptchaVerify({ req, res }) {
	const response = new Response({ res })
	const { email } = req.body
	const data = await getValue(email)
	if (!data) {
		response.send({ code: ResponseCode.EXPIRE, msg: 'no' })
	} else if (data === captcha) {
		delValue(email)
		response.send({ msg: 'ok' })
	} else {
		response.send({ msg: 'no' })
	}
}

module.exports = {
	getCaptcha,
	requestPasswordReset,
	requestEmailCaptcha,
	requestPasswordResetVerify,
	requestEmailCaptchaVerify,
	verifyCaptcha,
}
