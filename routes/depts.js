const router = require("koa-router")()
const util = require("./../utils/util")
const Dept = require("./../models/deptSchema")

router.prefix("/dept")

// 部门树形列表
router.get("/list", async (ctx) => {
  let { deptName } = ctx.request.query
  let params = {}
  if (deptName) params.deptName = deptName
  let rootList = await Dept.find(params)
  if (deptName) {
    ctx.body = util.success(rootList)
  } else {
    let treeList = getTreeDept(rootList, null, [])
    ctx.body = util.success(treeList)
  }
})

// 递归拼接树形列表
function getTreeDept(menuList, parentId, list) {
  console.log("进入递归")
  menuList.forEach((menu) => {
    if (String(menu.parentId[menu.parentId.length - 1]) == String(parentId)) {
      list.push(menu._doc)
      console.log("menu._doc======>", menu._doc)
    }
  })
  // 给上级菜单添加children属性
  list.forEach((menu) => {
    menu.children = []
    getTreeDept(menuList, menu._id, menu.children)
    if (menu.children.length == 0) {
      delete menu.children
    }
  })
  return list
}

// 部门操作：创建、编辑、删除
router.post("/operate", async (ctx) => {
  const { _id, action, ...params } = ctx.request.body
  let res, info
  try {
    if (action == "create") {
      await Dept.create(params)
      info = "创建成功"
    } else if (action == "edit") {
      params.updateTime = new Date()
      await Dept.findByIdAndUpdate(_id, params)
      info = "编辑成功"
    } else if (action == "delete") {
      await Dept.findByIdAndRemove(_id)
      await Dept.deleteMany({ parentId: { $all: [_id] } })
      info = "删除成功"
    }
    ctx.body = util.success("", info)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})

module.exports = router
