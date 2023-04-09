const mongoose = require("mongoose")

const roleSchema = mongoose.Schema({
  roleName: String,
  remark: String,
  permissionList: { checkedKeys: [], halfCheckedKeys: [] },
  createTime: { type: Date, default: Date.now() },
})

const Role = mongoose.model("role", roleSchema)

module.exports = Role
