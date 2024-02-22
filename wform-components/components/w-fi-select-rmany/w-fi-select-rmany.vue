<template>
  <view class="app-fi-select-rmany" >
		<view class="app-fi-select-rmany__input" @tap.stop="popupOpen">
			<view class="text">
				<view v-if="ficValue && ficValue.length" class="uni-input">
          {{viewContent}}
        </view>
				<text v-else class="place">
          {{placeholder}}
        </text>
			</view>
			<view>
				<slot name="right">
        </slot>
			</view>
		</view>

    <!-- 清空 -->
    <ua-icon
      v-if="(ficValue || ficValue === 0) && clearable"
      class="close-icon"
      name="close-circle-fill"
      @click.stop="ficValue = null"
    ></ua-icon>

    <ua-select
      v-model="popupShow"
      mode="mutil-column-auto"
      :list="list"
      :border="border"
      :cancelColor="cancelColor"
      :confirmColor="confirmColor"
      :zIndex="zIndex"
      :safeAreaInsetBottom="safeAreaInsetBottom"
      :maskCloseAble="maskCloseAble"
      :defaultValue="defaultValue"
      :valueName="valueName"
      :labelName="labelName"
      :childName="childName"
      :title="title"
      :cancelText="cancelText"
      :confirmText="confirmText"
      :blur="blur"
      @tap.native.stop
      @confirm="hanlderConfirm"
      @cancel="hanlderCancel"
    ></ua-select>
	</view>
</template>

<script>
  import { 
    defineComponent,
    ref,
    computed
  } from 'vue'
  import ficIntegrated from '../../hooks/fic-integrated'
  import getFicProps from '../../hooks/fic-props'
  import UaSelect from '../../depend/uview-ui/components/ua-select/ua-select.vue'
  import UaIcon from '../../depend/uview-ui/components/ua-icon/ua-icon.vue'
  import { queryTree } from '../../utils/functions'

  /**
   * app-fi-select-rmany 表单中的滚动选择，单列
   */
  export default defineComponent({
	  emits: ["confirm", "cancel"],
    props: {
      ...getFicProps(['fiConfig','placeholder']),
      // 是否可清空
      clearable: {
        type: [Boolean, String],
        default: true
      },
      // 选项分隔符
      separator: {
        type: String,
        default: '/'
      },

      // 通过双向绑定控制组件的弹出与收起
      // value: {
      //   type: Boolean,
      //   default: false
      // },
      // modelValue: {
      //   type: Boolean,
      //   default: false
      // },
      // 当mode=selector或者mode=multiSelector时，提供的数组
      // 通过双向绑定控制组件的弹出与收起
      // value: {
      //   type: Boolean,
      //   default: false
      // },
      // modelValue: {
      //   type: Boolean,
      //   default: false
      // },
      // 列数据
      list: {
        type: Array,
        default() {
          return [];
        }
      },
      // 是否显示边框
      border: {
        type: Boolean,
        default: true
      },
      // "取消"按钮的颜色
      cancelColor: {
        type: String,
        default: '#606266'
      },
      // "确定"按钮的颜色
      confirmColor: {
        type: String,
        default: '#2979ff'
      },
      // 弹出的z-index值
      zIndex: {
        type: [String, Number],
        default: 0
      },
      safeAreaInsetBottom: {
        type: Boolean,
        default: false
      },
      // 是否允许通过点击遮罩关闭Picker
      maskCloseAble: {
        type: Boolean,
        default: true
      },
      // 提供的默认选中的下标
      defaultValue: {
        type: Array,
        default() {
          return [0];
        }
      },
      // 模式选择，single-column-单列，mutil-column-多列，mutil-column-auto-多列联动
      // mode: {
      //   type: String,
      //   default: 'single-column'
      // },
      // 自定义value属性名
      valueName: {
        type: String,
        default: 'value'
      },
      // 自定义label属性名
      labelName: {
        type: String,
        default: 'label'
      },
      // 自定义多列联动模式的children属性名
      childName: {
        type: String,
        default: 'children'
      },
      // 顶部标题
      title: {
        type: String,
        default: ''
      },
      // 取消按钮的文字
      cancelText: {
        type: String,
        default: '取消'
      },
      // 确认按钮的文字
      confirmText: {
        type: String,
        default: '确认'
      },
      // 遮罩的模糊度
      blur: {
        type: [Number, String],
        default: 0
      },
    },
    setup(props,{emit}) {
      const { ficValue, placeholder, upOn } = ficIntegrated({
        props,
        type: 'select'
      });

      const viewContent = computed(() => {
        if (!ficValue.value?.length) {
          return ''
        } else {
          const nodes = queryTree(ficValue.value,props.list,props.valueName);
          let resText = nodes[0][props.labelName];
          for(let i = 1;i < nodes.length;i++) {
            resText += ` ${props.separator} ${nodes[i][props.labelName]}`
          }
          return resText
        }
      })

      // [pupup类型组件处理]
      // 弹框显隐
      const popupShow = ref(false);
      // 拉起弹框
      const popupOpen = () => {
        popupShow.value = true
      }

      // 此操作是为了让form-item被点击时也可以拉起此组件
      // 订阅事件：formItem被点击
      upOn('formItem:click',(param,{ childIndex }) => {
        // 自己在兄弟中排第一时
        if (childIndex === 0) popupOpen()
      })

      // 确定
      const hanlderConfirm = (data) => {
        const res = data.map(val => val[props.valueName]);
        ficValue.value = res;
        emit('confirm', res)
      }
      
      // 取消
      const hanlderCancel = data => {
        emit('cancel',data)
      }

      // 清空已选值
      function closeValue (){
        ficValue.value = null
      }

      return {
        ficValue,
        viewContent,
        placeholder,
        popupShow,
        popupOpen,
        hanlderConfirm,
        hanlderCancel,
        closeValue
      }
    },
    components: {
      UaSelect,
      UaIcon
    }
  })
</script>

<style lang="scss" scoped>
	.app-fi-select-rmany {
    position: relative;
		&__input {
			display: flex;
			margin-right: 60rpx;
			line-height: 70rpx;
			.text{
				flex:1;
			}
			.place {
				color: #c0c4cc;
			}
		}
    .close-icon{
      position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			color: #c0c4cc;
			z-index: 2;
			padding: 20rpx;
			height: 76rpx;
      font-size: 36rpx;
    }
	}
</style>
