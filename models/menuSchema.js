const mongoose = require("mongoose")

// 模板Schema定义了集合的数据结构
const menuSchema = mongoose.Schema({
  menuType: Number, //菜单类型
  menuName: String, //名称
  menuCode: String, //权限标识
  path: String, //路由地址
  icon: String, //图标
  component: String, //组件地址
  menuState: Number, //菜单状态
  parentId: [mongoose.Types.ObjectId], //生成 MongoDB 文档的唯一标识符的数据类型
  createTime: {
    type: Date,
    default: Date.now(),
  },
  lastLoginTime: {
    type: Date,
    default: Date.now(),
  },
})

const Menu = mongoose.model("menu", menuSchema)

module.exports = Menu
