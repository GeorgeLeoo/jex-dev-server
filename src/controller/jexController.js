const Response = require('../utils/Response')
const JexDB = require('../db/module/jexDB')
const ResponseCode = require('../utils/ResponseCode')
const { getDB } = require('../utils')

async function getJex ({ req, res }) {
  let { query, page, order, selects = [], unSelects = [], reference = [] } = req.body
  const { collectionName } = req.params
  const orderMap = {}
  if (order) {
    const orderKeys = Object.keys(order)
    if (orderKeys.length > 0) {
      if (order[orderKeys[0]] === 'desc') {
        orderMap[orderKeys[0]] = -1
      }
      if (order[orderKeys[0]] === 'asc') {
        orderMap[orderKeys[0]] = 1
      }
    }
  }
  let selectMap = {}
  let unselectMap = {}
  if (selects.length !== 0 || unSelects.length !== 0) {
    selects.map(v => {
      selectMap[v] = 1
    })
    if (selects.length !== 0 && !selects.includes('_id')) {
      unselectMap['_id'] = 0
    }
    unSelects.map(v => {
      unselectMap[v] = 0
    })
  }
  if (collectionName === 'User') {
    unselectMap = Object.assign({}, unselectMap, { password: 0 })
  }
  unselectMap = Object.assign({}, unselectMap)
  if (Object.keys(selectMap).length === 0) {
    unselectMap.__v = 0
  }
  selectMap = Object.assign({}, selectMap, unselectMap)
  reference = reference.map(v => {
    // 把需要的集合都调用一遍，这样才能注册到mongoose中
    getDB(v.path)
    v.path = v.path.toLowerCase()
    v.select = Object.assign({}, v.select)
    return v
  })
  // console.log(reference)
  const { code, msg, data } = await JexDB.getJex({
    collectionName,
    query,
    selectMap,
    reference,
    page,
    orderMap
  })
  const response = new Response({ req, res })
  response.send({ code, msg, data })
}

async function getCount ({ req, res }) {
  const { collectionName } = req.params
  const { code, msg, data } = await JexDB.getCount({ collectionName, query: req.body })
  const response = new Response({ req, res })
  response.send({ code, msg, data })
}

async function updateAndInsertJex ({ req, res }) {
  const { collectionName } = req.params
  const body = req.body
  const _id = body._id
  delete body._id
  let query = body.query
  let updateOrInsert = body.data
  if (_id) {
    query = { _id }
  }
  if (Object.keys(query).length > 0) {
    const { code, msg, data } = await JexDB.updateJex({ collectionName, query, update: updateOrInsert })
    const response = new Response({ req, res })
    response.send({ code, msg, data })
  } else {
    const { code, msg, data } = await JexDB.insertJex({ collectionName, insertData: updateOrInsert })
    const response = new Response({ req, res })
    response.send({ code, msg, data })
  }
}

async function removeJex ({ req, res }) {
  const { collectionName } = req.params
  const { code, msg, data } = await JexDB.removeJex({ collectionName, condition: req.body })
  const response = new Response({ req, res })
  response.send({ code, msg, data })
}

async function removeManyJex ({ req, res }) {
  const { collectionName } = req.params
  const { code, msg, data } = await JexDB.removeManyJex({ collectionName, condition: req.body })
  const response = new Response({ req, res })
  response.send({ code, msg, data })
}

async function incrementJex ({ req, res }) {
  const response = new Response({ req, res })
  const { collectionName } = req.params
  const { _id, incrementObj = {} } = req.body
  if (typeof _id !== 'string') {
    response.send({ code: ResponseCode.CLIENT_ERROR, msg: 'The _id must be String.' })
    return
  }
  if (!_id) {
    response.send({ code: ResponseCode.CLIENT_ERROR, msg: 'The _id can not be undefined or "".' })
    return
  }
  if (Object.keys(incrementObj).length === 0) {
    response.send({ code: ResponseCode.CLIENT_ERROR, msg: 'At a minimum, set the field name of the count.' })
    return
  }
  if (typeof incrementObj[Object.keys(incrementObj)[0]] !== 'number') {
    response.send({ code: ResponseCode.CLIENT_ERROR, msg: 'The value added must be a numeric type.' })
    return
  }
  const { code, msg, data } = await JexDB.incrementJex({ collectionName, _id, incrementObj })
  response.send({ code, msg, data })
}

async function statJex ({ req, res }) {
  const response = new Response({ req, res })
  const { collectionName } = req.params
  const { stat, order } = req.body
  const { code, msg, data } = await JexDB.statJex({ collectionName, stat, order })
  response.send({ code, msg, data })
}

module.exports = {
  getJex,
  getCount,
  updateAndInsertJex,
  removeJex,
  removeManyJex,
  incrementJex,
  statJex
}
