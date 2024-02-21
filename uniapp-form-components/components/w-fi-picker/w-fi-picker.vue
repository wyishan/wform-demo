<template>
  <view class="app-fi-picker" >
		<view class="app-fi-picker__input" @tap.stop="popupOpen">
			<view class="text">
				<view v-if="ficValue" class="uni-input">
          <template v-if="mode === 'selector'">{{ficValue[rangeKey]}}</template>
          <template v-else-if="mode === 'time'">{{ficValue}}</template>
        </view>
				<text v-else class="place">{{placeholder}}</text>
			</view>
			<view>
				<slot name="right">
        </slot>
			</view>
		</view>

    <!-- 清空 -->
    <ua-icon 
      v-if="ficValue && clearable" 
      class="close-icon" 
      name="close-circle-fill" 
      @tap.stop="ficValue = null"
    ></ua-icon>

    <ua-picker 
      v-model="popupShow" 
      :params="params"
      :range="range"
      :defaultSelector="defaultSelector"
      :rangeKey="rangeKey"
      :mode="mode"
      :startYear="startYear"
      :endYear="endYear"
      :cancelColor="cancelColor"
      :confirmColor="confirmColor"
      :defaultTime="defaultTime"
      :defaultRegion="defaultRegion"
      :showTimeTag="showTimeTag"
      :areaCode="areaCode"
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
    ref
  } from 'vue'
  import ficIntegrated from '../../hooks/fic-integrated'
  import getFicProps from '../../hooks/fic-props'
  import UaPicker from '../../depend/uview-ui/components/ua-picker/ua-picker.vue'
  import UaIcon from '../../depend/uview-ui/components/ua-icon/ua-icon.vue'

  /**
   * app-fi-prcker 表单中的滚动选择
   */
  export default defineComponent({
    // "update:modelValue", "input", 
	  emits: ["confirm", "cancel"],
    props: {
      ...getFicProps(['fiConfig','placeholder']),
      // 是否可清空
      clearable: {
        type: [Boolean, String],
        default: true
      },
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

      // 以下为转接参数
      // picker中需要显示的参数
      params: {
        type: Object,
        default() {
          return {
            year: true,
            month: true,
            day: true,
            hour: false,
            minute: false,
            second: false,
            province: true,
            city: true,
            area: true,
            timestamp: true
          };
        }
      },
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
        default: ""
      },
      // 模式选择，region-地区类型，time-时间类型，selector-单列模式，multiSelector-多列模式
      mode: {
        type: String,
        default: "selector"
      },
      // 年份开始时间
      startYear: {
        type: [String, Number],
        default: 1950
      },
      // 年份结束时间
      endYear: {
        type: [String, Number],
        default: 2050
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
      // 默认显示的时间，2025-07-02 || 2025-07-02 13:01:00 || 2025/07/02
      defaultTime: {
        type: String,
        default: ""
      },
      // 默认显示的地区，可传类似["河北省", "秦皇岛市", "北戴河区"]
      defaultRegion: {
        type: Array,
        default() {
          return [];
        }
      },
      // 时间模式时，是否显示后面的年月日中文提示
      showTimeTag: {
        type: Boolean,
        default: true
      },
      // 默认显示地区的编码，defaultRegion和areaCode同时存在，areaCode优先，可传类似["13", "1303", "130304"]
      areaCode: {
        type: Array,
        default() {
          return [];
        }
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
      const hanlderConfirm = data => {
        if (props.mode === 'selector') {
          if (props.range.length === 0) {
            ficValue.value = null;
          } else {
            ficValue.value = props.range[data.index]
          }
        } else if(props.mode === ''){
          console.log('其他选中---',data)
        }
        emit('confirm',data)
      }
      
      // 取消
      const hanlderCancel = data => {
        emit('cancel',data)
      }

      return {
        ficValue,
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
	.app-fi-picker {
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
