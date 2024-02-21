<template>
  <w-form v-model="form">
    <w-form-item label="活动名称" props="name">
      <w-fi-input></w-fi-input>
    </w-form-item>
    <w-form-item label="活动区域" props="region">
      <w-fi-select-rone :range="regionRange"></w-fi-select-rone>
    </w-form-item>
    <w-form-item label="活动时间" props="date">
      <w-fi-time-roll mode="date-time"></w-fi-time-roll>
    </w-form-item>
    <w-form-item label="即使配送" props="delivery">
      <w-fi-switch></w-fi-switch>
    </w-form-item>
    <w-form-item label="活动性质" props="type">
      <w-fi-checkbox :options="typeOptions" multiple></w-fi-checkbox>
    </w-form-item>
    <w-form-item label="特殊资源" props="resource">
      <w-fi-checkbox :options="resourceOptions"></w-fi-checkbox>
    </w-form-item>
    <w-form-item label="活动形式" props="desc">
      <w-fi-input type="textarea"></w-fi-input>
    </w-form-item>
    <button @click="submit">提交</button>
  </w-form>
</template>

<script>

export default {
  data() {
    return {
      form: {},
      regionRange: [
        { "label": "区域一","value": 'shanghai' },
        { "label": "区域二","value": 'beijing' }
      ],
      typeOptions: [
        { "label": "美食/餐厅线上活动","value": 'ms' },
        { "label": "地推活动","value": 'dt' },
        { "label": "线下主题活动","value": 'xx' },
        { "label": "单纯品牌曝光","value": 'pp' }
      ],
      resourceOptions: [
        { "label": "线上品牌商赞助","value": 'xs' },
        { "label": "线下场地免费","value": 'xx' }
      ]
    }
  },
  methods: {
    submit() {
      uni.showModal({
        content: 'form的值：' + JSON.stringify(this.form)
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>