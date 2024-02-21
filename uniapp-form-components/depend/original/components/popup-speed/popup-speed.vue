<template>
	<ua-popup class="app-popup-speed"
			 :model-value="show"
			 mode="center"
			 :duration="200"
			 :closeable="false">
		<view class="u-pop-cont">
			<view class="title">{{title}}</view>
			<ua-line-progress active-color="#2979ff" :percent="percent"></ua-line-progress>
		</view>
	</ua-popup>
</template>

<script>
  import UaLineProgress from '../../../uview-ui/components/ua-line-progress/ua-line-progress.vue'
  import UaPopup from '../../../uview-ui/components/ua-popup/ua-popup.vue'
	export default {
		/**
		 * app-popup-speed 弹出框原形进度条
		 * @property {String | Number} percent 圆环进度百分比值，为数值类型，0-100
		 * @property {Boolean} show 是否显示
		 * @property {String} title 中间字段
		 */
		props:{
			percent:{
				type:[String,Number],
				default:0
			},
			show:{
				type:Boolean,
				default:false
			},
			title:{
				type:String,
				default:'正在上传...'
			}
		},
    components: {
      UaLineProgress,
      UaPopup
    }
	}
</script>

<style lang="scss" scoped>
	.u-pop-cont{
		background-color: #fff;
		padding:14rpx;
		border-radius: 20rpx;
		overflow: hidden;
		width: 300rpx;
		height: 172rpx;
		.title{
			text-align: center;
		}
	}
</style>
