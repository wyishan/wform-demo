<template>
  <view class="index">
    <view class="content">
      <div v-for="item in pages" :key="item.path" class="box" @click="navigatiTo(item.path)">
        {{item.style.navigationBarTitleText}}
      </div>
    </view>
  </view>
</template>

<script>
import pagesJson from '../../pages.json'

export default {
	data() {
		return {
			pages: pagesJson.pages
		}
	},
  methods: {
    navigatiTo(path) {
      uni.navigateTo({
      	url: '/' + path
      })
    }
  }
}
</script>

<style lang="scss" scope>
.index {
  padding: 20rpx;
  .content{
    display: grid;
    grid-template-columns: 31.33% 31.33% 31.33%;
    grid-template-rows: 31.33% 31.33% 31.33%;
    grid-row-gap: 8%;
    grid-column-gap: 3%;
    .box{
      display: flex;
      justify-content: center;
      align-items: center;
      border:1rpx solid #ddd;
      background-color: #fafafa;
      height: 100rpx;
    }
  }
}
</style>