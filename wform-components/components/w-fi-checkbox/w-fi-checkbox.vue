<template>
  <!--  :class="{'po-ev-no':$_appFormItem_read}" -->
	<view class="app-form-item-checkbox">
    <!-- :selectedColor="project.color" -->
		<uni-data-checkbox 
      :mode="mode"
      :localdata="options"
      :map="{
        text: labelKey,
        value: valueKey
      }"
      :multiple="multiple"
      :min="min"
			:max="max"
			:wrap="wrap"
			:icon="icon"
			:selectedColor="selectedColor"
			:selectedTextColor="selectedTextColor"
			:emptyText="emptyText"
			:disabled="disabled"
      @change="e => $emit('change',e)"
      v-model="ficValue"
    ></uni-data-checkbox>
	</view>
</template>

<script>
  import UniDataCheckbox from '../../depend/uni/components/uni-data-checkbox/uni-data-checkbox.vue';
  import getFicProps from '../../hooks/fic-props'
  import ficIntegrated from '../../hooks/fic-integrated'
  
  /**
   * app-form-item-checkbox 表单里的单选多选
   * uni-data-checkbox组件: https://uniapp.dcloud.io/component/uniui/uni-data-checkbox
   * @property {String} mode checkbox的model 
   * @property {Boolean} multiple 是否为多选
   * @property {Array} options checkbox的localdata
   * @property {String | Number} default 默认值
   */
	export default {
		emits:['change'],
    props:{
      ...getFicProps(['fiConfig']),

      // 以下为转接参数
			mode:{
				type: String,
				default: 'default'
			},
			labelKey:{
				type: String,
				default: 'label'
			},
			valueKey:{
				type: String,
				default: 'value'
			},
      options:{
				type: Array,
				default: () => []
			},
      multiple: {
        type: Boolean
      }, 
			// default:{
			// 	type:[String,Number]
			// },
			// value: {
			// 	type: [Array, String, Number],
			// 	default () {
			// 		return ''
			// 	}
			// },
			// modelValue: {
			// 	type: [Array, String, Number],
			// 	default() {
			// 		return '';
			// 	}
			// },
			min: {
				type: [Number, String],
				default: ''
			},
			max: {
				type: [Number, String],
				default: ''
			},
			wrap: {
				type: Boolean,
				default: false
			},
			icon: {
				type: String,
				default: 'left'
			},
			selectedColor: {
				type: String,
				default: ''
			},
			selectedTextColor: {
				type: String,
				default: ''
			},
			emptyText:{
				type: String,
				default: '暂无数据'
			},
			disabled:{
				type: Boolean,
				default: false
			}
    },
		setup(props) {
      const { ficValue } = ficIntegrated({
        props,
        type: 'select'
      });

      return {
        ficValue
      }
    },
    components: {
      UniDataCheckbox
    }
	}
</script>

<style lang="scss" scoped>
	.app-form-item-checkbox{
		padding:14rpx 0 5rpx;
	}
</style>