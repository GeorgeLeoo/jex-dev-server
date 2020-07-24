const express = require('express')const Router = express.Router()
Router.get('/files', async function (req, res) {


function main({ req, res }) {

  res.send({ code: 0, ok: "success", msg: 'files' });
}


main({req, res})

})

module.exports = Router