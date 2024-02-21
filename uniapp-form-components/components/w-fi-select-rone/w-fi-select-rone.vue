<template>
  <view class="app-fi-select-rone" >
		<view class="app-fi-select-rone__input" @tap.stop="popupOpen">
			<view class="text">
				<view v-if="ficValue || ficValue === 0" class="uni-input">
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
    <!-- 箭头 -->
    <ua-icon
      class="arrow-down" 
      name="arrow-down" 
    ></ua-icon>

    <ua-picker 
      v-model="popupShow" 
      mode="selector"
      :range="range"
      :defaultSelector="defaultSelector"
      :rangeKey="rangeKey"
      :cancelColor="cancelColor"
      :confirmColor="confirmColor"
      :safeAreaInsetBottom="safeAreaInsetBottom"
      :maskCloseAble="maskCloseAble"
      :zIndex="zIndex"
      :title="title"
      :cancelText="cancelText"
      :confirmText="confirmText"
      :blur="blur"
      @tap.native.stop
      @confirm="hanlderConfirm"
      @cancel="hanlderCancel"
    ></ua-picker>
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
  import UaPicker from '../../depend/uview-ui/components/ua-picker/ua-picker.vue'
  import UaIcon from '../../depend/uview-ui/components/ua-icon/ua-icon.vue'

  /**
   * app-fi-select-rone 表单中的滚动选择，单列
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
      range: {
        type: Array,
        default() {
          return [];
        }
      },
      // 当mode=selector或者mode=multiSelector时，提供的默认选中的下标
      defaultSelector: {
        type: Array,
        default() {
          return [0];
        }
      },
      // 当 range 是一个 Array＜Object＞ 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容
      rangeKey: {
        type: String,
        default: "label"
      },
      valueKey: {
        type: String,
        default: "value"
      },
      // "取消"按钮的颜色
      cancelColor: {
        type: String,
        default: "#606266"
      },
      // "确定"按钮的颜色
      confirmColor: {
        type: String,
        default: "#2979ff"
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
      // 弹出的z-index值
      zIndex: {
        type: [String, Number],
        default: 0
      },
      // 顶部标题
      title: {
        type: String,
        default: ""
      },
      // 取消按钮的文字
      cancelText: {
        type: String,
        default: "取消"
      },
      // 确认按钮的文字
      confirmText: {
        type: String,
        default: "确认"
      },
      // 遮罩的模糊度
      blur: {
        type: [String, Number],
        default: 0
      }
    },
    setup(props,{emit}) {
      const { ficValue, placeholder, upOn } = ficIntegrated({
        props,
        type: 'select'
      });

      const viewContent = computed(() => {
        for(let i = 0;i < props.range.length;i++) {
          if (props.range[i][props.valueKey] === ficValue.value) {
            return props.range[i][props.rangeKey]
          }
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
      const hanlderConfirm = ([index]) => {
        if (props.range.length === 0) {
          ficValue.value = null;
        } else {
          ficValue.value = props.range[index][props.valueKey]
        }
        emit('confirm',[index])
      }
      
      // 取消
      const hanlderCancel = data => {
        emit('cancel',data)
      }

      return {
        ficValue,
        viewContent,
        placeholder,
        popupShow,
        popupOpen,
        hanlderConfirm,
        hanlderCancel
      }
    },
    components: {
      UaPicker,
      UaIcon
    }
  })
</script>

<style lang="scss" scoped>
	.app-fi-select-rone {
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
			right: 36rpx;
			top: 50%;
			transform: translateY(-50%);
			color: #c0c4cc;
			z-index: 2;
			padding: 20rpx;
			height: 76rpx;
      font-size: 36rpx;
    }
    
    .arrow-down{
      position: absolute;
			right: 0rpx;
			top: 50%;
			transform: translateY(-50%);
			color: #c0c4cc;
			z-index: 2;
			height: 76rpx;
      font-size: 30rpx;
    }
	}
</style>
