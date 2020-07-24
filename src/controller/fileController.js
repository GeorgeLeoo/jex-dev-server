const Response = require('../utils/Response')
const fileDB = require('../db/module/fileDB')

async function uploadFile ({ req, res }) {
  const { files } = req.files
  const data = await fileDB.uploadFile(files)
  console.log(data)
  const result = { url: [], msg: [] }
  data.map(v => {
    if (v.url) {
      result.url.push(v.url)
    }
    if (v.msg) {
      result.msg.push(v.msg)
    }
  })
  const response = new Response({ req, res })
  response.send({ data: result })
}

module.exports = {
  uploadFile
}
