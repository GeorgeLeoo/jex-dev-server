const express = require('express')
const UserRouter = express.Router()
const UserController = require('./../controller/userController')

UserRouter.post('/current', async function (req, res) {
  await UserController.getCurrent({ req, res })
})

UserRouter.post('/logout', async function (req, res) {
  await UserController.logout({ req, res })
})

UserRouter.post('/sign-in', async function (req, res) {
  await UserController.signIn({ req, res })
})

UserRouter.post('/sign-up', async function (req, res) {
  await UserController.signUp({ req, res })
})

module.exports = UserRouter
