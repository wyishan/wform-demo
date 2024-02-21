<template>
  <w-form v-model="form" required ref="wForm" :rules="rules">
    <w-form-item label="人员1" props="user1">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="人员2" props="user2">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="人员3" props="user3">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="人员4" props="user4">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="活动名称" props="name">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <button @click="submit">提交</button>
  </w-form>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      rules: {
        name: { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
      }
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