const ResponseCode = require('./../../utils/ResponseCode')
const { setValue, getValue } = require('../../utils/redis')
const { getDB, accessToken } = require('./../../utils')
const User = 'User'

function signUp ({ username, password, email, phone }) {
  return new Promise(resolve => {
    if (!username) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The username can not be undefined.' })
    }
    if (!password) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The password can not be undefined.' })
    }
    getDB(User).insertMany({ username, password, email, phone }, (err, docs) => {
        if (err) {
          if (err.code === 11000) {
            // resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The username already exists.' })
            const field = err.writeErrors[0].errmsg.split('dup key: ')[1].split(':')[0].split('{ ')[1]
            resolve({ code: ResponseCode.EXIST, msg: { field, msg: `The ${field} already exists.` } })
          } else {
            resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
          }
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: [] })
        }
      }
    )
  })
}

function signIn ({ username, password }) {
  return new Promise(resolve => {
    if (!username) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The username can not be undefined.' })
    }
    if (!password) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The password can not be undefined.' })
    }
    getDB(User).find({ username, password }, async (err, users) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else if (users.length === 0) {
        resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The username or password is wrong.' })
      } else {
        // 生成token
        let token = accessToken({ username })
        // 存储当前用户到redis，实现在线人数
        const data = users[0]
        setValue(token.token, data.uid)
        getValue(token.token).then(res => {
          console.log(res)
        }).catch(e=>{
          console.log(e)
        })
        resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: { token: token.token, uid: data._id } })
      }
    })
  })
}

function current (uid, showPwd = false) {
  return new Promise((resolve) => {
    getDB(User).find({ _id: uid }, { pwd: showPwd ? 1 : 0, __v: 0 },(err, users) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        if (users.length > 0) {
          resolve({ code: ResponseCode.SUCCESS, data: users[0] })
        } else {
          resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The _id is not exist.' })
        }
      }
    })
  })
}

module.exports = {
  signUp,
  signIn,
  current
}
