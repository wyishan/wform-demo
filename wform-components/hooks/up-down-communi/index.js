// up-down-communi 上下级通信。
import {
  isString,
  getType,
  isFun
} from '../../utils/functions'
import { 
  provide, 
  inject,
  reactive, 
  onBeforeUnmount 
} from 'vue'

// 给一个前缀，避免与其他变量冲突
const PROVIDE_AFTER = '$backflow_input_'

/**
 * getChildren 获取在某个端口上活跃的子组件列表
 * @param {String} port 端口名
 * @return 活跃的子组件列表，实时更新
 */
export const getChildren = (port) => {
  // 获取同端口的上级
  const superior = inject(`${PROVIDE_AFTER}${port}`);

  // 子组件列表
  const childList = reactive([])

  // 添加一个子组件
  const addChild = data => {
    childList.push(data);

    // 继续向上通知
    if(superior) superior.addChild(data) 
  }

  // 删除一个子组件
  const removeChild = uid => {
    const index = childList.findIndex(i => i.uid === uid);
    if(index !== -1) childList.splice(index,1)

    // 继续向上通知
    if(superior) superior.removeChild(uid)
  }

  provide(`${PROVIDE_AFTER}${port}`,{
    addChild,
    removeChild
  })

  return childList
}

/**
 * checkIn 下层组件向某个端口报到，并提供信息
 * @param {String} port 端口名
 * @param {Number} uid 组件唯一值。可通过getCurrentInstance获取。
 * @param {All} context 向上汇报的上下文
 * @return {Function} upOn 订阅上级组件事件的方法
 */
export const checkIn = ({port,uid,type,context}) => {
  const superior = inject(`${PROVIDE_AFTER}${port}`);

  // 所有的监听回调
  let watchStore = {}
  /**
   * upOn 添加一个监听的回调
   * @param {String} name 监听事件名称
   * @param {Function} callBack 回调函数。入参一：触发事件的参数。参数二：
   * @returns removeWatch 回调函数，用于删除监听
   */
  /**
   * callBack 回调函数
   * @param {*} param 触发时的传入参数 
   * @param {*} e 其他参数 
   * @param {Number} e.childIndex 本组件在发布信息组件中的位置
   */
  const upOn = (name,callBack) => {
    if(!name) {
      return console.error(`upOn的第一个入参不能为空。`)
    } else if(!isString(name)) {
      return console.error(`upOn的第一个入参需要为String类型，但当前为${getType(name)}类型。`)
    } else if(!callBack) {
      return console.error(`upOn的第二个入参不能为空。`)
    } else if(!isFun(callBack)) {
      return console.error(`upOn的第二个入参需要为function类型，但当前为${getType(callBack)}类型。`)
    }

    if (watchStore[name]) watchStore[name].push(callBack)
    else watchStore[name] = [callBack];

    // 删除监听
    const removeWatch = () => {
      let index = watchStore[name].findIndex(fn => fn === callBack);
      if(index !== -1) watchStore[name].splice(index,1)
    }
    return removeWatch
  }
  
  // 将数据添加至
  if (superior) {
    superior.addChild({
      uid,
      type,
      context,
      watchStore
    })
  
    onBeforeUnmount(() => {
      superior.removeChild(uid)
    })
  } else {
    console.error(`ger-children error：端口“${port}”，没有找到port一致的上级组件。`)
  }
  
  return upOn
}

// 获取downEmit（触发下级事件监听的方法）
export const getDownEmit = (...childListAll) => {
  return (name,param) => {
    if(!name) {
      return console.error(`downEmit的第一个入参不能为空。`)
    } else if(!isString(name)) {
      return console.error(`downEmit的第一个入参需要为String类型，但当前为${getType(name)}类型。`)
    }

    // 遍历所有childList
    childListAll.forEach((childList) => {
      
      // 遍历所有childList下的组件
      childList.forEach((child,childIndex) => {

        if(child.watchStore[name]?.length) {
          // 触发所有回调
          // 先拷贝下，防止触发过程中回调列表变化
          const callBacks = [...child.watchStore[name]];
          callBacks.forEach(callBack => {
            callBack(param,{ childIndex })
          })
        }
      })
    })
  }
}
