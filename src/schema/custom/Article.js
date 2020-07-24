// Auto build by build/index.js
  
const db = require('../../db/conn')
const Schema = db.Schema
const JexSchema = new Schema({
  title: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  content: {
    type: String
  }
})
module.exports = db.model('Articles', JexSchema)
