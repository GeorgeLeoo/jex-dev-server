const ResponseCode = require('./../../utils/ResponseCode')
const { isObject } = require('../../utils/dataType')
const { isArray } = require('../../utils/dataType')
const { isString } = require('../../utils/dataType')
const { getDB } = require('./../../utils')
const basePath = '/Users/jxd/Documents/GitHub/jex-server/upload'

function saveFile (file) {
  return new Promise(((resolve) => {
    let fileName = '/' + new Date().getTime() + '.jpg'
    file.mv(basePath + fileName, function (e) {
      if (e) {
        resolve({ msg: e })
      } else {
        resolve({ url: fileName })
      }
    })
  }))
}

async function uploadFile (files) {
  const results = files.map(file => {
    return new Promise(async resolve1 => {
      const result = await saveFile(file)
      resolve1(result)
    })
  })
  let arr = []
  arr = await Promise.all(results)
  return arr
}

module.exports = {
  uploadFile
}
