<template>
	<view class="app-fi-upload">
    <!-- v-if="!iModel.length" -->
		<!-- <template v-if="true">
			<view class="place">暂无</view>
		</template> -->
    <!--  v-if="iModel.length" -->
		<template v-if="true">
      <!-- 
        :custom-btn="$_appFormItem_read ? true : customBtn" 
        :deletable="$_appFormItem_read ? false : deletable"
      -->
      <!-- :file-list="iModel" -->
			<ua-upload 
        ref="uaUpload" 
        :showUploadList="showUploadList"
        :action="action"
        :maxCount="maxCount"
        :showProgress="showProgress"
        :disabled="disabled"
        :imageMode="imageMode"
        :header="header"
        :formData="formData"
        :name="name"
        :sizeType="sizeType"
        :sourceType="sourceType"
        :previewFullImage="previewFullImage"
        :multiple="multiple"
        :deletable="deletable"
        :maxSize="maxSize"
        :fileList="fileList"
        :uploadText="uploadText"
        :autoUpload="autoUpload"
        :showTips="showTips"
        :customBtn="customBtn"
        :width="width"
        :height="height"
        :delBgColor="delBgColor"
        :delColor="delColor"
        :delIcon="delIcon"
        :successIcon="successIcon"
        :successColor="successColor"
        :toJson="toJson"
        :beforeUpload="beforeUpload"
        :beforeRemove="beforeRemove"
        :limitType="limitType"
        :index="index"
        @on-oversize="e => $emit('on-oversize',e)"
        @on-list-change="e => $emit('on-list-change',e)"
        @on-preview="e => $emit('on-preview',e)"
        @on-remove="hanlderOnRemove"
        @on-success="hanlderOnSuccess"
        @on-change="e => $emit('on-change',e)"
        @on-error="hanlderOnError"
        @on-progress="hanlderOnProgress"
        @on-uploaded="hanlderOnUploaded"
        @on-choose-complete="hanlderOnChooseComplete"
        @on-choose-fail="e => $emit('on-choose-fail',e)"
      >
			</ua-upload>
		</template>
		<!-- 进度条 -->
		<popup-speed :show="loadShow" :percent="loadPercent"></popup-speed>
	</view>
</template>

<script>
  import { ref } from 'vue'
  import PopupSpeed from '../../depend/original/components/popup-speed/popup-speed.vue'
  import UaIcon from '../../depend/uview-ui/components/ua-icon/ua-icon.vue'
  import UaUpload from '../../depend/uview-ui/components/ua-upload/ua-upload.vue'
	// import ficIntegrated from '../../hooks/fic-integrated'
  // import getFicProps from '../../hooks/fic-props'
  import ficIntegrated from '../../hooks/fic-integrated'
  import getFicProps from '../../hooks/fic-props'

  export default {
		/**
		 * app-form-item-upload 表单中的上传图片模块
		 * @property {Object} form-data 上传图片的额外参数
		 * @property {Number} max-count 最大上传个数
		 * @property {Boolean} custom-btn 是否使用图标形态上传按钮
		 * @property {Boolean} deletable 是否允许删除
		 * @property {Number} width 宽
		 * @property {Number} height 高
		 * @property {Number} size 宽高
		 * @event upload 上传成功后的回调，参数为后台响应数据
		 */
		props: {
      ...getFicProps(['fiConfig']),

      //是否显示组件自带的图片预览功能
      showUploadList: {
        type: Boolean,
        default: true
      },
      // 后端地址
      action: {
        type: String,
        default: ""
      },
      // 头部信息
      header: {
        type: Object,
        default() {
          return {};
        }
      },
      // 最大上传数量
      maxCount: {
        type: [String, Number],
        default: 52
      },
      //  是否显示进度条
      showProgress: {
        type: Boolean,
        default: true
      },
      // 是否启用
      disabled: {
        type: Boolean,
        default: false
      },
      // 预览上传的图片时的裁剪模式，和image组件mode属性一致
      imageMode: {
        type: String,
        default: "aspectFill"
      },
      // 额外携带的参数
      formData: {
        type: Object,
        default() {
          return {};
        }
      },
      // 上传的文件字段名
      name: {
        type: String,
        default: "file"
      },
      // 所选的图片的尺寸, 可选值为original compressed
      sizeType: {
        type: Array,
        default() {
          return ["original", "compressed"];
        }
      },
      sourceType: {
        type: Array,
        default() {
          return ["album", "camera"];
        }
      },
      // 是否在点击预览图后展示全屏图片预览
      previewFullImage: {
        type: Boolean,
        default: true
      },
      // 是否开启图片多选，部分安卓机型不支持
      multiple: {
        type: Boolean,
        default: true
      },
      // 是否展示删除按钮
      deletable: {
        type: Boolean,
        default: true
      },
      // 文件大小限制，单位为byte
      maxSize: {
        type: [String, Number],
        default: Number.MAX_VALUE
      },
      // 显示已上传的文件列表
      fileList: {
        type: Array,
        default() {
          return [];
        }
      },
      // 上传区域的提示文字
      uploadText: {
        type: String,
        default: "选择图片"
      },
      // 是否自动上传
      autoUpload: {
        type: Boolean,
        default: true
      },
      // 是否显示toast消息提示
      showTips: {
        type: Boolean,
        default: true
      },
      // 是否通过slot自定义传入选择图标的按钮
      customBtn: {
        type: Boolean,
        default: false
      },
      // 内部预览图片区域和选择图片按钮的区域宽度
      width: {
        type: [String, Number],
        default: 200
      },
      // 内部预览图片区域和选择图片按钮的区域高度
      height: {
        type: [String, Number],
        default: 200
      },
      // 右上角关闭按钮的背景颜色
      delBgColor: {
        type: String,
        default: "#fa3534"
      },
      // 右上角关闭按钮的叉号图标的颜色
      delColor: {
        type: String,
        default: "#ffffff"
      },
      // 右上角删除图标名称，只能为uView内置图标
      delIcon: {
        type: String,
        default: "close"
      },
      // 右下角成功图标名称，只能为uView内置图标
      successIcon: {
        type: String,
        default: "checkbox-mark"
      },
      // 右下角成功的叉号图标的颜色
      successColor: {
        type: String,
        default: "#ffffff"
      },
      // 如果上传后的返回值为json字符串，是否自动转json
      toJson: {
        type: Boolean,
        default: true
      },
      // 上传前的钩子，每个文件上传前都会执行
      beforeUpload: {
        type: Function,
        default: null
      },
      // 移除文件前的钩子
      beforeRemove: {
        type: Function,
        default: null
      },
      // 允许上传的图片后缀
      limitType: {
        type: Array,
        default() {
          // 支付宝小程序真机选择图片的后缀为"image"
          // https://opendocs.alipay.com/mini/api/media-image
          return ["png", "jpg", "jpeg", "webp", "gif", "image"];
        }
      },
      // 在各个回调事件中的最后一个参数返回，用于区别是哪一个组件的事件
      index: {
        type: [Number, String],
        default: ""
      }
		},
    setup(props, { emit }) {
      const { ficValue } = ficIntegrated({
        props
      });

      // 是否显示进度条
			const loadShow = ref(false)
			// 进度条百分比
			const loadPercent = ref(0)
      // ua-upload ref
      const uaUpload = ref()

      // 上传成功
			const hanlderOnSuccess = (data, index, lists, name) => {
        ficValue.value = lists;
				emit('on-success', data);
			}

			// 上传失败
			const hanlderOnError = (res, index, lists, name) => {
				// this.iModel = lists;
				emit('on-error', data);
			}

			// 移除
			const hanlderOnRemove = (index, lists, name) => {
        ficValue.value = lists;
				emit('on-remove', index);
			}

			// 图片选择完毕，开始上传
			const hanlderOnChooseComplete = (...e) => {
				// this.$_appForm_setPopupActive(true);
				loadShow.value = true;
				emit('on-choose-complete',...e);
			}

			// 上传进度
			const hanlderOnProgress = ({ progress }, index, lists, name) => {
				loadPercent.value = progress > 90 ?
					90 :
					progress
			}

			// 全部上传完成
			const hanlderOnUploaded = (lists, name) => {
				loadPercent.value = 100;
				loadShow.value = false;
				// this.$_appForm_setPopupActive(false);
			}

			// 手动删除一个图片
			const remove = (index) => {
				uaUpload.remove(index);
			}

      return {
        loadShow,
        loadPercent,
        hanlderOnSuccess,
        hanlderOnError,
        hanlderOnRemove,
        hanlderOnChooseComplete,
        hanlderOnProgress,
        hanlderOnUploaded,
        remove,
        uaUpload
      }
    },
    components: {
      PopupSpeed,
      UaIcon,
      UaUpload
    }
	}
</script>

<style lang="scss" scoped>
  .app-fi-upload{
    padding:10rpx 0 5rpx;
  }
	.upload-button {
		position: absolute;
		padding: 20rpx;
		font-size: 45rpx;
		right: 0;
		top: 0;
		z-index: 2;
	}

	.place {
		pointer-events: none;
		line-height: 70rpx;
	}
</style>
