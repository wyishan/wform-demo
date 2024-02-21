<template>
  <w-form v-model="form" required ref="wForm">
    <w-form-item label="活动名称" props="name">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="活动时间" props="date">
      <w-fi-time-roll mode="date-time"></w-fi-time-roll>
    </w-form-item>
    <button @click="submit">提交</button>
  </w-form>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    submit() {
      this.$refs.wForm.validate(vali => {
        uni.showToast({
          title: vali ? '通过' : '不通过',
          icon: 'none'
        });
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>