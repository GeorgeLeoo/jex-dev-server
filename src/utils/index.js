const jwt = require('jsonwebtoken')
const { APP_PATH } = require('./../../build/utils')

module.exports = {
  getDB_URL: function ({ ip, port, username, password, dbName, authSource }) {
    if (!ip || !port) {
      throw 'The ip and port must be required.'
    }
    if (!dbName) {
      throw 'The dbName must be required.'
    }
    if (!username && !password && !authSource) {
      console.warn('The database is best logged in using authentication.')
      return `mongodb://${ip}:${port}/${dbName}`
    } else {
      return `mongodb://${username}:${password}@${ip}:${port}/${dbName}?authSource=${authSource}`
    }
  },
  getDB(collectionName) {
    return require(`${APP_PATH}/schema/custom/${collectionName}.js`)
  },
  /**
   * 生成token
   * @param {object} content  对某个内容生成 token
   */
  accessToken: function (content) {
    let secret = 'jex-token-vxcbvcbbtrreuqwioeuoqwdhbci2374985rytguwegr9823gdiusagbfoqwu0' // 秘钥
    // let expiresIn = Math.round((new Date().getTime() / 1000)) + 3600; // 过期时间
    let expiresIn = 60 * 60 * 24 // 过期时间
    // let expiresIn = 1; // 立刻过期
    let token = jwt.sign(content, secret, { expiresIn })
    return {
      token,
      expiresIn
    }
  },
  /**
   * 验证token
   * @param {string} token token值
   */
  checkToken: function (token) {
    let secret = 'jex-token-vxcbvcbbtrreuqwioeuoqwdhbci2374985rytguwegr9823gdiusagbfoqwu0' // 秘钥，根生成的 token 要一致
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, err => {
        if (err) {
          //时间失效或伪造 token 或 token 不存在
          reject({ status: 40003, err: 'invalid_token' })
        } else {
          resolve({ status: 201 })
        }
      })
    })
  },
  deepClone: function (source) {
    if (!source && typeof source !== 'object') {
      throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = module.exports.deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    })
    return targetObj
  }
}
