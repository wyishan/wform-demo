<template>
  <ua-input 
    :type="type"
    :inputAlign="inputAlign"
    :placeholder="placeholderAuto" 
    :disabled="disabled"
    :maxlength="maxlength"
    :placeholderStyle="placeholderStyle"
    :confirmType="confirmType"
    :customStyle="customStyle"
    :fixed="fixed"
    :focus="focus"
    :passwordIcon="passwordIcon"
    :border="border"
    :borderColor="borderColor"
    :autoHeight="autoHeight"
    :selectOpen="selectOpen"
    :height="height"
    :clearable="clearable"
    :cursorSpacing="cursorSpacing"
    :selectionStart="selectionStart"
    :selectionEnd="selectionEnd"
    :trim="trim"
    :showConfirmbar="showConfirmbar"
    @input="e => $emit('input',e)"
    @change="e => $emit('change',e)"
    @blur="e => $emit('blur',e)"
    @focus="e => $emit('focus',e)"
    @click="e => $emit('click',e)"
    @touchstart="e => $emit('touchstart',e)"
    v-model="ficValue"
  />
</template>

<script>
  import { 
    defineComponent
  } from 'vue'
  import ficIntegrated from '../../hooks/fic-integrated'
  import getFicProps from '../../hooks/fic-props'
  import UaInput from '../../depend/uview-ui/components/ua-input/ua-input.vue'

  /**
   * app-fi-input 表单中的输入框
   */
  export default defineComponent({
    // "update:modelValue", 
	  emits: ["input", "change", "blur", "focus", "click", "touchstart"],
    props: {
      ...getFicProps(['fiConfig','placeholder']),

      // 以下为转接参数
      // 输入框的类型，textarea，text，number
      type: {
        type: String,
        default: "text"
      },
      inputAlign: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: ""
      },
      disabled: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: [Number, String],
        default: 140
      },
      placeholderStyle: {
        type: String,
        default: "color: #c0c4cc;"
      },
      confirmType: {
        type: String,
        default: "done"
      },
      // 输入框的自定义样式
      customStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true
      fixed: {
        type: Boolean,
        default: false
      },
      // 是否自动获得焦点
      focus: {
        type: Boolean,
        default: false
      },
      // 密码类型时，是否显示右侧的密码图标
      passwordIcon: {
        type: Boolean,
        default: true
      },
      // input|textarea是否显示边框
      border: {
        type: Boolean,
        default: false
      },
      // 输入框的边框颜色
      borderColor: {
        type: String,
        default: "#dcdfe6"
      },
      autoHeight: {
        type: Boolean,
        default: true
      },
      // type=select时，旋转右侧的图标，标识当前处于打开还是关闭select的状态
      // open-打开，close-关闭
      selectOpen: {
        type: Boolean,
        default: false
      },
      // 高度，单位rpx
      height: {
        type: [Number, String],
        default: ""
      },
      // 是否可清空
      clearable: {
        type: [Boolean, String],
        default: true
      },
      // 指定光标与键盘的距离，单位 px
      cursorSpacing: {
        type: [Number, String],
        default: 0
      },
      // 光标起始位置，自动聚焦时有效，需与selection-end搭配使用
      selectionStart: {
        type: [Number, String],
        default: -1
      },
      // 光标结束位置，自动聚焦时有效，需与selection-start搭配使用
      selectionEnd: {
        type: [Number, String],
        default: -1
      },
      // 是否自动去除两端的空格
      trim: {
        type: Boolean,
        default: true
      },
      // 是否显示键盘上方带有”完成“按钮那一栏
      showConfirmbar: {
        type: Boolean,
        default: true
      },
      // 弹出键盘时是否自动调节高度，uni-app默认值是true
      adjustPosition: {
        type: Boolean,
        default: true
      },
      // input的背景色
      backgroundColor: {
        type: String,
      },
      // input的padding
      padding: {
        type: String,
      },
    },
    setup(props) {
      const { ficValue, placeholder } = ficIntegrated({
        props
      });
      
      return {
        ficValue,
        placeholderAuto: placeholder
      }
    },
    components: {
      UaInput
    }
  })
</script>

<style lang="scss" scoped>

</style>