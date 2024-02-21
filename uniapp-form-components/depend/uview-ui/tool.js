import config from './libs/config/config'
import addUnit from './libs/function/addUnit'
// import throttle from './libs/function/throttle.js'
// // 去除空格
import trim from './libs/function/trim.js'
// 各个需要fixed的地方的z-index配置文件
import zIndex from './libs/config/zIndex.js'
// 对象和数组的深度克隆
import deepClone from './libs/function/deepClone.js'
// 规则检验
import test from './libs/function/test.js'

const $tool = {
  config,
  addUnit,
  // throttle,
  trim,
  zIndex,
  deepClone,
  test
}

export default $tool;