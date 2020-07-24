// Auto build by build/index.js
  
const db = require('../../db/conn')
const Schema = db.Schema
const JexSchema = new Schema({
  score: {
    type: Number
  },
  money: {
    type: Number
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  remark: {
    type: String
  }
})
module.exports = db.model('ArticleScores', JexSchema)
