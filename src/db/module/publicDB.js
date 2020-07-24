const ResponseCode = require('./../../utils/ResponseCode')
const { getDB } = require('./../../utils')
const PasswordReset = 'PasswordReset'

function createPasswordReset ({ to, expire }) {
  return new Promise(resolve => {
    getDB(PasswordReset).insertMany({ to, expire }, (err, docs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: docs })
      }
    }
  )
  })
}

function getPasswordReset (_id) {
  return new Promise(resolve => {
    getDB(PasswordReset).find({ _id }, (err, docs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: docs })
      }
    }
  )
  })
}

function updatePasswordReset (_id) {
  return new Promise(resolve => {
    getDB(PasswordReset).updateMany({ _id }, { $set: { hasReset: true } }, (err, docs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: docs })
      }
    }
  )
  })
}

module.exports = {
  createPasswordReset,
  getPasswordReset,
  updatePasswordReset
}