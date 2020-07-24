const ResponseCode = require('./../../utils/ResponseCode')
const { isObject } = require('../../utils/dataType')
const { isArray } = require('../../utils/dataType')
const { isString } = require('../../utils/dataType')
const { getDB } = require('./../../utils')
const defaultPage = { limitNumber: 100, skipNumber: 1 }

function getJex ({ collectionName, query, selectMap = {}, reference, page = defaultPage, orderMap }) {
  return new Promise(resolve => {
    if (!collectionName) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The collectionName can not be undefined.' })
    }
    const DB = getDB(collectionName)
    DB.find(query, selectMap, { __v: 0 })
      .populate(reference)
      .limit(parseInt(page.limitNumber))
      .skip((parseInt(page.skipNumber) - 1) * parseInt(page.limitNumber))
      .sort(orderMap)
      .exec((err, docs) => {
        if (err) {
          console.log(err)
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: docs })
        }
      })
  })
}

function getCount ({ collectionName, query }) {
  return new Promise(resolve => {
    if (!collectionName) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The collectionName can not be undefined.' })
    }
    if (query.type !== 'count' && isObject(query) && Object.keys(query).length === 0) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The query can not be undefined or empty object.' })
    } else if (query.type === 'count') {
      query = {}
    }
    const DB = getDB(collectionName)
    DB.countDocuments(query, function (err, count) {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: { count } })
      }
    })
  })
}

function updateJex ({ collectionName, query, update }) {
  return new Promise(resolve => {
    if (!collectionName) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The collectionName can not be undefined.' })
    }
    if (!query || Object.keys(query).length === 0) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The query can not be undefined or empty object.' })
    }
    if (!update || Object.keys(update).length === 0) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The update can not be undefined or empty object.' })
    }
    const DB = getDB(collectionName)
    DB.updateMany(query, { $set: update }, (err, docs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        if (docs.n >= 1 && docs.ok === 1 && docs.nModified >= 1) {
          resolve({ code: ResponseCode.SUCCESS, msg: 'ok' })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: 'no' })
        }
      }
    })
  })
}

function insertJex ({ collectionName, insertData }) {
  return new Promise(resolve => {
    if (!collectionName) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The collectionName can not be undefined.' })
    }
    if (!insertData || Object.keys(insertData).length === 0) {
      resolve({ code: ResponseCode.CLIENT_ERROR, msg: 'The insertData can not be undefined or empty object.' })
    }
    const DB = getDB(collectionName)
    DB.insertMany(insertData, (err, docs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: docs })
      }
    })
  })
}

function removeJex ({ collectionName, condition }) {
  return new Promise(resolve => {
    if (!collectionName) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: 'The collectionName can not be undefined.' })
    }
    if (!condition || Object.keys(condition).length === 0) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: 'The condition can not be undefined or empty object.' })
    }
    const DB = getDB(collectionName)
    DB.deleteMany(condition, (err, docs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else if (docs.ok === 1 && docs.n > 0 && docs.deletedCount > 0) {
        resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: [] })
      }
    })
  })
}

function removeManyJex ({ collectionName, condition }) {
  return new Promise(resolve => {
    if (!collectionName) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: 'The collectionName can not be undefined.' })
    }
    if (!isArray(condition) || condition.length === 0) {
      resolve({
        code: ResponseCode.SERVICE_ERROR,
        msg: 'The condition can must be array type and condition length must > 0.'
      })
    }
    const DB = getDB(collectionName)
    condition.map(v => {
      DB.deleteMany({ _id: v }, (err, docs) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
        } else if (docs.ok === 1 && docs.n > 0 && docs.deletedCount > 0) {
          resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: [] })
        }
      })
    })
  })
}

function incrementJex ({ collectionName, _id, incrementObj }) {
  return new Promise(resolve => {
    if (!collectionName) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: 'The collectionName can not be undefined.' })
    }
    if (!_id) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: 'The _id can not be undefined.' })
    }
    if (!incrementObj || Object.keys(incrementObj).length === 0) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: 'The incrementObj can not be undefined or empty object.' })
    }
    const DB = getDB(collectionName)
    DB.updateMany({ _id }, { $inc: incrementObj }, (err, docs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        if (docs.n === 1 && docs.ok === 1 && docs.nModified === 1) {
          resolve({ code: ResponseCode.SUCCESS, msg: 'ok' })
        } else {
          resolve({ code: ResponseCode.SUCCESS, msg: 'no' })
        }
      }
    })
  })
}

function statJex ({ collectionName, stat, order }) {
  return new Promise(resolve => {
    const statKeys = Object.keys(stat)
    if (!collectionName) {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: 'The collectionName can not be undefined.' })
    }
    const orderMap = {
      'desc': -1,
      'asc': 1
    }
    let match = null
    let total = {}
    let groupby = null
    let sort = null
    if (order) {
      const orderKeys = Object.keys(order)
      if (orderKeys.length > 0) {
        sort = { $sort: { [orderKeys[0]]: orderMap[order[orderKeys[0]]] } }
      }
    }
    statKeys.map(v => {
      const statItem = stat[v]
      if (v === 'sum') {
        if (isString(statItem)) {
          total[`_sum_${statItem}`] = { [`$${v}`]: `$${statItem}` }
        } else if (isArray(statItem)) {
          statItem.map(item => {
            total[`_sum_${item}`] = { [`$${v}`]: `$${item}` }
          })
        }
      }
      if (v === 'groupby') {
        if (isString(statItem)) {
          groupby = `$${statItem}`
        } else if (isArray(statItem)) {
          const _groupby = {}
          statItem.map(item => {
            _groupby[item] = `$${item}`
          })
          groupby = _groupby
        }
      }
      if (v === 'order') {
        const orderKeys = Object.keys(statItem)
        const sortOptions = {}
        orderKeys.map(value => {
          sortOptions[value] = orderMap[statItem[value]]
        })
        if (orderKeys.length > 0) {
          sort = { $sort: sortOptions }
        }
      }
      if (v === 'having') {
        match = statItem
      }
      if (v === 'groupcount') {
        total._count = { $sum: 1 }
      }
      if (v === 'avg') {
        total[`_${v}_${statItem}`] = { [`$${v}`]: `$${statItem}` }
      }
      if (v === 'max') {
        total[`_${v}_${statItem}`] = { [`$${v}`]: `$${statItem}` }
      }
      if (v === 'min') {
        total[`_${v}_${statItem}`] = { [`$${v}`]: `$${statItem}` }
      }
    })
    const DB = getDB(collectionName)
    const pipeline = []
    pipeline.push({
      $group: {
        _id: groupby,
        ...total
      }
    })
    if (match) {
      pipeline.push({
        $match: match
      })
    }
    if (sort) {
      pipeline.push(sort)
    }
    console.log(JSON.stringify(pipeline))
    DB.aggregate(pipeline, (err, docs) => {
      if (err) {
        console.log(err)
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err.message })
      } else {
        resolve({ code: ResponseCode.SUCCESS, msg: 'ok', data: docs })
      }
    })
  })
}

module.exports = {
  getJex,
  getCount,
  updateJex,
  insertJex,
  removeJex,
  removeManyJex,
  incrementJex,
  statJex
}
