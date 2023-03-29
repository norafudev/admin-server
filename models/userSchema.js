const mongoose = require("mongoose")

// 模板Schema定义了集合的数据结构
const userSchema = mongoose.Schema({
  userId: Number, //用户ID，自增长
  userName: String, //用户名称
  userPwd: String, //用户密码，md5加密
  userEmail: String, //用户邮箱
  mobile: String, //手机号
  sex: Number, //性别 0:男  1：女
  deptId: [], //部门
  job: String, //岗位
  state: {
    type: Number,
    default: 1,
  }, // 1: 在职 2: 离职 3: 试用期
  role: {
    type: Number,
    default: 1,
  }, // 用户角色 0：系统管理员  1： 普通用户
  roleList: [], //系统角色
  createTime: {
    type: Date,
    default: Date.now(),
  }, //创建时间
  lastLoginTime: {
    type: Date,
    default: Date.now(),
  }, //更新时间
  remark: String,
})

// 以UserSchema为模板，创建model模型-User，模型用来创建和连接集合
const User = mongoose.model("users", userSchema, "users")

exports.default = User
