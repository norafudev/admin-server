const router = require("koa-router")()
const Menu = require("../models/menuSchema")
const util = require("../utils/util")

router.prefix("/menu")

// 菜单列表
router.get("/list", async (ctx) => {
  const { menuState, menuName } = ctx.request.query
  const params = {}
  if (menuName) params.menuName = menuName
  if (menuState) params.menuState = menuState
  let menuList = (await Menu.find(params)) || []
  const treeMenu = getTreeMenu(menuList, null, [])
  ctx.body = util.success(treeMenu)
})

// 递归拼接树形列表
function getTreeMenu(menuList, parentId, list) {
  console.log("进入递归")
  //pi数组的最后一个元素等于我们传入的id，就推进数组
  menuList.forEach((menu) => {
    // !!!数据库中的id都是 ObjectID 类型的对象，需要转成字符串，否则比较的就是对象的内存地址
    if (String(menu.parentId[menu.parentId.length - 1]) == String(parentId)) {
      list.push(menu._doc)
      console.log("menu._doc======>", menu._doc)
    }
  })
  // 给上级菜单添加children属性
  list.forEach((menu) => {
    menu.children = []
    getTreeMenu(menuList, menu._id, menu.children)
    if (menu.children.length == 0) {
      delete menu.children
    } else if (menu.children.length > 0 && menu.children[0].menuType == 2) {
      // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
      menu.action = menu.children
    }
  })
  return list
}

// 菜单新增、编辑、删除
router.post("/operate", async (ctx) => {
  const { action, _id, ...params } = ctx.request.body
  let info
  //   新增
  try {
    if (action == "add") {
      const res = await Menu.create(params)
      info = "创建成功"
      // 编辑
    } else if (action == "edit") {
      const res = await Menu.findOneAndUpdate({ _id: _id }, params)
      info = "编辑成功"
      params.updateTime = new Date()
      // 删除
    } else {
      const res = await Menu.findByIdAndRemove(_id)
      await Menu.deleteMany({ parentId: { $all: [_id] } })
      info = "删除成功"
    }
    ctx.body = util.success({}, info)
  } catch (error) {
    ctx.body = util.fail(`菜单操作失败：${error.stack}`)
  }
})

module.exports = router
