<template>
  <!--  :class="{apret:!!$_appFormBlock_apret}" -->
  <view class="app-form-item" :class="['app-uid_' + uid]" @click="formItemClick">
    <!--  :class="{dispatch}" @click="itemClick" -->
		<view class="app-form-item__content">
			<view class="app-form-item__left">
				<view class="label">
					<text v-if="!hideRequired && isChildExistVali" class="requried">*</text>
					<text>
						<text>{{label}}</text>
						<text v-if="remarks">（{{remarks}}）</text>
					</text>
				</view>
				<view>
					<slot name="right"></slot>
				</view>
			</view>
			<!-- 叶子组件区域 -->
			<view class="app-form-item__content__right">
				<slot></slot>
			</view>
		</view>
		<view class="message" v-if="bottomMessage">
			<view >{{bottomMessage}}</view>
		</view>
	</view>
</template>

<script>
  import { 
    ref,
    defineComponent,
    inject,
    provide,
    getCurrentInstance,
    computed,
  } from 'vue'
  import {
    isArray,
    getPropsValue
  } from '../../utils/functions'
  import { checkIn, getChildren, getDownEmit } from '../../hooks/up-down-communi'
  import { FORM_ITEM_PROT, FIC_PROT } from '../../constant/prots'
  import customCheck from '../../utils/customCheck'

  /**
   * app-form-item 表单项，为内部专用组件提供对应参数和方法
   * @property {String | Array} item-key 在根数据中的键，控制根数据多个项时为数组，不关联数据时可以不填
   * @property {Array} item-key-path 在item-key的基础上追加数据路径，若item-key为数组item-key-path应为二维数组
   * @property {String | Array} modelKey 选中值含有object类型时需要传入modelKey方便比对是否有更新，默认为“id”
   * @property {String} label 左侧提示文字
   * @property {Boolean} required 显示左边红色 * 号，并且会添加一个必填的效验（配置rule后该效验会失效）
   * @property {Array} rule 表单效验
   * @property {String} remarks 备注信息，显示在label右侧
   * @property {String} placeholder 输入框为空时的占位符
   * @property {String} dispatch 是否禁用该选项
   * @property {String} dispatch-text 禁用提示语
   * @property {Boolean} hide-required 是否隐藏红色星号
   * @property {Boolean} i-read 是否只读
   * @event {Function} clear 选择框被清空时
   * @slot default 一般此处会放置表单模块组件，有一个参数iModel
   */
  export default defineComponent({
    props: {
      label: {
        type: String
      },
      remarks: {
        type: String
      },
      props: {
        type: [String, Array]
      },
      required: {},
			rule: {},
      hideRequired: {
        type: Boolean
      }
    },
    setup(props) {
      const currentInstance = getCurrentInstance();
      
      const appForm = inject('appForm',undefined);
      // 获取所有活跃的app-fi-***
      let appFicList = getChildren(FIC_PROT);
      const downEmit = getDownEmit(appFicList);
       // 本props是否有效
      const propsIsEffect = isArray(props.props) || !!props.props;
      // props类型
      const propsIsArray = isArray(props.props);

      // 本项值
      const itemValue = computed(() => {
        if (isArray(props.props)) {
          return getPropsValue(appForm.formData,props.props)
        } else if(props.props) {
          return appForm.formData[props.props]
        }
      })

      // (获取本组件根节点)
      const getNode = () => {
        return uni.createSelectorQuery().in(currentInstance).select(`.app-uid_${currentInstance.uid}`)
      }

      // [校验模块]
      // (获取应该使用的required和rule)
      const getRequiredRule = () => {
        let appFormRule;
        if(props.required !== undefined || props.rule !== undefined) { // 其次使用form-item
          return {
            rule,
            required: props.required === '' ? true : props.required // 无属性值代表true
          }
        } else if(
          appForm.required
          || (
              propsIsArray
                ? appFormRule = appForm.rules[props.props[props.props.length - 1]] // props为数组时，取末端字符去rules里找
                : appFormRule = appForm.rules[props.props]
            )
        ) { // 其次使用form
          return {
            required: appForm.required,
            rule: appFormRule
          }
        } else {
          return false
        }
      }
      // item的独立校验的提示文字
      let itemNoPassMessage = ref('');
      // (validate 开始校验)
      const validate = () => {
        return new Promise((resolve) => {
          // (通过-回调)
          const success = () => {
            itemNoPassMessage.value = ''
            resolve({ isSuccess: true })
          }

          // (不通过-回调)
          const noSuccess = (message) => {
            itemNoPassMessage.value = message;
            resolve({ 
              isSuccess: false,
              message,
              node: getNode()
            })
          }

          const requiredRule = getRequiredRule()
          if (
            propsIsEffect
            && requiredRule
            && (requiredRule.required || requiredRule.rule?.length)
          ) {
            // *item有独立的校验。因为props有效；rule或required有效。
            const { required, rule } = props;
            customCheck({
              value: itemValue.value,
              required,
              rule,
              type: appFicList.length ? appFicList[0].type : 'default',
              keywords: props.label
            })
              .then(success)
              .catch(noSuccess)
          } else {
            // *item无独立校验
            success()
          }
        })
      }

      // 向上级组件报到
      checkIn({
        port: FORM_ITEM_PROT,
        uid: currentInstance.uid,
        context: {
          validate
        }
      })
      // 底部提示文字
      const bottomMessage = computed(() => {
        if (itemNoPassMessage.value) {
          // 优先展示item本体的
          return itemNoPassMessage.value
        } else {
          // 其次展示fic组件的
          const fic = appFicList.find(item => item.context.noPassMessage);
          return fic ? fic.context.noPassMessage : ''
        }
      })
      // 是否有至少一个子项的校验有效
      const isChildExistVali = computed(() => {
        return appFicList.some(fic => !!fic.context.isValidateEffective)
      });
      
      // 被点击
      const formItemClick = () => {
        downEmit('formItem:click');
      }

      provide('appFormItem', {
        ...props,
        currentInstance,
        getNode
      })

      return {
        bottomMessage,
        isChildExistVali,
        formItemClick,
        uid: currentInstance.uid
      }
    }
  })
</script>

<style lang="scss" scoped>

.app-form-item {
  padding-bottom: 20rpx;
  
  &.apret {
    padding-top: 3rpx;
  }
}

.app-form-item {
  &__content{
    padding: 26rpx 30rpx 15rpx;
    min-height: 80rpx;
    background-color: #fff;
    position: relative;
    font-size: 28rpx;
  }
  &__left {
    line-height: 1;
    position: relative;
    display: flex;
    .label{
      flex:1;
    }
    .requried {
      left: -16rpx;
      top: 0;
      line-height: 36rpx;
      position: absolute;
      color: #FF0101;
    }
  }
  &__right {
    flex: 1;
    position: relative;
  }

  &__u-icon {
    position: absolute;
    right: 20rpx;
    top: 50%;
    transform: translateY(-50%);
    color: #c0c4cc;
    z-index: 2;
  }

  &__icon-box {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #c0c4cc;
    z-index: 2;
    padding: 20rpx;
    height: 76rpx;
    .u-icon {
      float: left;
    }
  }

  &.dispatch {
    .app-form-item__right,
    .app-form-item__left {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}

.message {
  background-color: #FDEAE6;
  color: #C97D60;
  font-size: 24rpx;
  line-height: 40rpx;
  padding-left: 30rpx;
}
</style>