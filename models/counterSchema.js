/**
 * 用户ID自增长
 */

const mongoose = require("mongoose")

const counterSchema = mongoose.Schema({
  _id: String,
  seq: Number,
})

const Counter = mongoose.model("counter", counterSchema)

module.exports = Counter
