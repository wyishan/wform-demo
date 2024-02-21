<template>
  <w-form v-model="form" required ref="wForm" auto-lock>
    <w-form-item label="字段1" props="user1">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段2" props="user2">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段3" props="user3">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段4" props="user4">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段5" props="user5">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段6" props="user6">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段7" props="user7">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段8" props="user8">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段9" props="user9">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段10" props="user10">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段11" props="user11">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="字段12" props="user12">
      <w-fi-input></w-fi-input>
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