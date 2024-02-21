<template>
  <view class="app-fi-switch">
    <ua-switch 
      :loading="loading"
      :disabled="disabled"
      :size="size"
      :activeColor="activeColor"
      :inactiveColor="inactiveColor"
      :vibrateShort="vibrateShort"
      :activeValue="activeValue"
      :inactiveValue="inactiveValue"
      @change="e => $emit('change',e)"
      v-model="ficValue"
    />
  </view>
</template>

<script>
  import { 
    defineComponent
  } from 'vue'
  import ficIntegrated from '../../hooks/fic-integrated'
  import getFicProps from '../../hooks/fic-props'
  import UaSwitch from '../../depend/uview-ui/components/ua-switch/ua-switch.vue'

  /**
   * app-fi-input 表单中的输入框
   */
  export default defineComponent({
    // "update:modelValue", 
    emits: ["update:modelValue", "input", "change"],
    props: {
      ...getFicProps(['fiConfig']),

      // 通过v-model双向绑定的值
      value: {
        type: Boolean,
        default: false
      },
      modelValue: {
        type: Boolean,
        default: false
      },
      // 是否为加载中状态
      loading: {
        type: Boolean,
        default: false
      },
      // 是否为禁用装填
      disabled: {
        type: Boolean,
        default: false
      },
      // 开关尺寸，单位rpx
      size: {
        type: [Number, String],
        default: 50
      },
      // 打开时的背景颜色
      activeColor: {
        type: String,
        default: "#2979ff"
      },
      // 关闭时的背景颜色
      inactiveColor: {
        type: String,
        default: "#ffffff"
      },
      // 是否使手机发生短促震动，目前只在iOS的微信小程序有效(2020-05-06)
      vibrateShort: {
        type: Boolean,
        default: false
      },
      // 打开选择器时的值
      activeValue: {
        type: [Number, String, Boolean],
        default: true
      },
      // 关闭选择器时的值
      inactiveValue: {
        type: [Number, String, Boolean],
        default: false
      }
    },
    setup(props) {
      const { ficValue, placeholder } = ficIntegrated({
        props,
        type: 'select'
      });

      return {
        ficValue,
        placeholder
      }
    },
    components: {
      UaSwitch
    }
  })
</script>

<style lang="scss" scoped>
.app-fi-switch{
  padding-top: 12px;
}
</style>