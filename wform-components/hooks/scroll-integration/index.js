import { ref, nextTick  } from 'vue'
 
// scroll-integration.js 滚动控制的集成
export default ({ currentInstance, scrollSelector }) => {
  const scrollTop = ref(0); // 目标滚动值
  const old = ref({ // 当前滚动值
    scrollTop: 0
  }) 
  // 记录滚动值
  const scrollChange = e => {
    old.value.scrollTop = e.detail.scrollTop;
  }
  // scrollAppointEl 滚动到指定元素位置
  const scrollAppointEl = targetNode => {
    const asyncTask = [
      new Promise(resolve => {
        uni.createSelectorQuery().in(currentInstance).select(scrollSelector)
          .fields({
            size: true,
            rect: true,
            scrollOffset: true
          }, resolve)
          .exec();
      }),
      new Promise(resolve => {
        targetNode.boundingClientRect(resolve).exec();
      })
    ]
    Promise.all(asyncTask)
      .then(([aInfo, eInfo]) => {
        // 如果已经在视口范围内则不需要滚动
        if (eInfo.top - aInfo.top > 0 && eInfo.top - aInfo.top < aInfo.height - eInfo.height - 50) return;
        scrollTop.value = old.value.scrollTop;
        nextTick(() => {
          scrollTop.value = aInfo.scrollTop - aInfo.top - 100 + eInfo.top;
        })
      })
  }
  return {
    scrollTop,
    old,
    scrollChange,
    scrollAppointEl
  }
}