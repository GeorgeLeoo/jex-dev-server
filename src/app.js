const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const fileUpload = require("express-fileupload");

// const jexRouter = require('./routes/jexRouter')
// const userRouter = require('./routes/userRouter')
// const fileRouter = require('./routes/fileRouter')
// const publicRouter = require('./routes/publicRouter')

const ResponseCode = require('./utils/ResponseCode')

const Response = require('./utils/Response')
const { whiteList } = require('./config')
const { checkToken } = require('./utils')

const app = express()

app.use(compression())
app.use(helmet())
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')))

function hasToken ({ token, req, res, next }) {
  const response = new Response({ req, res })
  checkToken(token).then(async data => {
      req.data = data
      next()
    })
    .catch(err => {
      response.send({ code: ResponseCode.UN_AUTHORIZATION, msg: 'Token is invalid.' })
    })
}

app.use(function (req, res, next) {
  const param = req.originalUrl || req.params.collectionName
  if (whiteList.indexOf(param) > -1) {
    next()
  } else {
    const token = req.headers['x-jex-token']
    // console.log(token)
    if (!token) {
      const response = new Response({ req, res })
      response.send({ code: ResponseCode.UN_AUTHORIZATION, msg: 'Token is invalid.' })
    } else {
      hasToken({ token, req, res, next })
    }
  }
})

app.use('/jex', require('./routes/jexRouter'))
app.use('/jex/user', require('./routes/userRouter'))
app.use('/jex/file', require('./routes/fileRouter'))
app.use('/jex/public', require('./routes/publicRouter'))

module.exports = app
