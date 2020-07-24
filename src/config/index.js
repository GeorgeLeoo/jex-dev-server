const _whiteList = require('./../../configuration/whiteList.json')
const systemWhiteList = require('./system/systemWhiteList.json')
const db = require('./../../configuration/db.json')
const { getDB_URL } = require('./../utils')

const getWhiteList = function () {
  const list = Object.assign({}, systemWhiteList, _whiteList)
  const keys = Object.keys(list)
  const flg = keys.every(v => {
    if (!v.includes('_')) {
      return false
    }
    const vs = v.split('_')
    if (vs[0] !== 'url') {
      return false
    }
    return Number.isInteger(Number(vs[1]))
  })
  if (!flg) {
    throw new Error('The whiteList key must like this: url_1, url_2, url_3')
  }
  return Object.values(list)
}

const captchaOptions = {
  noise: 0,
  height: 31,
  width: 100,
  fontSize: 36
}

const emailConfig = {
  host: 'smtp.qq.com',
  port: 465,
  auth: {
    user: '18921483103@qq.com', //刚才注册的邮箱账号
    pass: 'fdpzsisgpmbfdgeg'  //邮箱的授权码，不是注册时的密码
  }
}

module.exports = {
  whiteList: getWhiteList(),
  DB_URL: getDB_URL(db),
  JexCaptchaKey: 'JexCaptchaKey',
  captchaOptions,
  emailConfig
}
