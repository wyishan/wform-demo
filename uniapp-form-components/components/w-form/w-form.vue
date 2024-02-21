<template>
	<view 
    class="app-form"
    :style="{
      height
    }"
  >
		<scroll-view class="scroll-content"
           :class="[`scroll-content-uid_${uid}`]"
					 scroll-y 
					 scroll-with-animation 
					 :scroll-top="scrollTop" 
					 @scroll="scrollChange">
			<slot></slot>
		</scroll-view>
		<slot name="bottom"></slot>
	</view>
</template>

<script>
  import {
    getPropsParentLayer,
    isObject,
    isArray
  } from '../../utils/functions'
  import {
    defineComponent,
    defineExpose,
    provide,
    getCurrentInstance,
    ref,
    computed
  } from 'vue'
  import scrollIntegration from '../../hooks/scroll-integration'
  import { getChildren } from '../../hooks/up-down-communi'
  import { FORM_ITEM_PROT, FIC_PROT } from '../../constant/prots'

  /**
   * app-form 表单
   * @property {Object} model 表单的根数据
   * @property {Boolean} read 是否为只读
   * @property {String} height app-form的height
   * @slot default 主要插槽
   */
  export default defineComponent({
    props: {
      modelValue: {
        type: Object
      },
      // read:{
      //   type: Boolean,
      //   required: false
      // },
      required: {
        type: Boolean,
        default: false
      },
			rules: {
        type: Object,
        default: () => ({})
      },
      autoLock: {
        type: Boolean,
        default: false
      }
    },
    emits: ['modelChange'],
    setup(props,{emit}) {
      let height;
      uni.getSystemInfo({
        success: res => {
          height = props.autoLock ? `calc(100vh - ${res.windowTop}px)` : 'auto'
        }
      })
      const currentInstance = getCurrentInstance();

      // 获取所有活跃的app-form-item app-fi-***
      const appFormItemList = getChildren(FORM_ITEM_PROT);
      const appFicList = getChildren(FIC_PROT);

      // [基础数据部分]
      const interFormData = ref({});// 内部表单数据
      // 最终使用的表单数据
      const formData = computed(() => {
        return isObject(props.modelValue)
          ? props.modelValue
          : interFormData.value // *没有绑定v-model时，使用内部的表单数据
      })
      /**
       * updateFormData 更新最终使用的表单数据
       * @param {String | Array<String>} props 需要更新的数据，在表单中的字段。或者是多个字段组成的路径。
       * @param {Any} value 赋的值
       */
      const updateFormData = (hereProps,value) => {
        const upFun = (data) => {
          if (isArray(hereProps)) {
            // *当props为数组时
            // 1.拿到props位置数据的前一层
            const parentData = getPropsParentLayer(data,props);
            // 2.拿到props的末尾项
            const lastProp = hereProps[hereProps.length - 1];
            // 3.更改
            parentData[lastProp] = value;
          } else {
            data[hereProps] = value;
          }
        }

        if (isObject(props.modelValue)) {
          // *更新v-model绑定值
          // 此处更新v-model值是子组件直接更改绑定值，有些违背vue组件规范，但是方便了很多。
          upFun(props.modelValue)
          emit('modelChange', {
            props,
            value
          })
        } else {
          // *更新组件内的表单数据
          upFun(interFormData.value)
        }
      }
      
      // [表单校验部分]
      // (validate)
      const validate = (callBack = (() => {})) => {
        // 从所有app-form-item及app-fi-** 组件中取出vilidate校验
        const childList = [...appFicList,...appFormItemList]
        const asyncValidateAll = childList.map(child => {
          return child.context.validate()
        })
        
        Promise.all(asyncValidateAll)
          .then(res => {
            const errInfo = res.find(i => !i.isSuccess); // 寻找错误信息

            // 触发回调
            callBack(
              !errInfo, // 是否通过
              JSON.parse(JSON.stringify({...formData.value})) // 表单数据
            )

            if(errInfo) scrollAppointEl(errInfo.node); // 滚动至错误位置
          })
      }

      // [滚动设置部分]
			const {
        scrollTop,
        old,
        scrollChange,
        scrollAppointEl
      } = scrollIntegration({ 
        currentInstance, 
        scrollSelector: '.scroll-content-uid_' + currentInstance.uid
      })

      // 向下发布
      provide('appForm',{
        height: props.height,
        required: props.required,
        rules: props.rules,
        formData: formData.value,
        updateFormData
      })

      // 供$refs使用
      defineExpose({
        validate
      })

      return {
        validate,
        scrollTop,
        old,
        scrollChange,
        scrollAppointEl,
        uid: currentInstance.uid,
        height
      }
    }
  })
</script>

<style lang="scss" scoped>
.scroll-content{
  flex:1;
  overflow: hidden;
}
.app-form {
  // height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F8F8F8;
  font-size: 28rpx;
  .read{
    pointer-events:none;
  }
  .gap {
    height: 20rpx;
  }
}
</style>