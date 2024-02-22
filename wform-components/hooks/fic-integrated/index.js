import { 
  inject,
  getCurrentInstance,
  computed,
  ref
} from 'vue'
import {
  getPropsValue,
  isArray,
  isObject
} from '../../utils/functions'
import { checkIn } from '../../hooks/up-down-communi'
import { FIC_PROT } from '../../constant/prots'
import customCheck from '../../utils/customCheck'

/**
 * fic-integrated.js app-fi-**组件通用的功能项集成
 * props props
 * type 叶子组件类型，有效值：pupup
*/
export default function fiUniversalIntegrated ({ props, type = 'default' }) {
  const currentInstance = getCurrentInstance();
  const appForm = inject('appForm',undefined);
  const appFormItem = inject('appFormItem',undefined);

  const fiConfig = props.fiConfig || {}
  // 主要使用的props, 优先使用fiConfig中的props
  const hostProps = fiConfig.props || appFormItem.props;
  // 主props类型
  const hostPropsIsArray = isArray(hostProps);
  
  // 本项值的虚拟ref
  const ficValue = computed({
    get() {
      if (isObject(appForm.formData)) {
        // *v-model绑定的需要为json，才有效
        if (hostPropsIsArray) return getPropsValue(appForm.formData,hostProps)
        else return appForm.formData[hostProps]
      } else {
        return ''
      }
    },
    set(val) {
      if (isObject(appForm.formData)) { 
        appForm.updateFormData(hostProps,val)
      } 
    }
  })

  // [校验模块]
  // (获取应该使用的required和rule)
  const getRequiredRule = () => {
    if (fiConfig.required !== undefined || fiConfig.rule !== undefined) { // 优先使用叶子组件
      return fiConfig
    } else if(appFormItem.required !== undefined || appFormItem.rule !== undefined) { // 其次使用form-item
      return {
        rule: appFormItem.rule,
        required: appFormItem.required === '' ? true : appFormItem.required // 无属性值代表true
      }
    } else if(
      appForm.required
      || (
          hostPropsIsArray
            ? appForm.rules[hostProps[hostProps.length - 1]] // props为数组时，取末端字符去rules里找
            : appForm.rules[hostProps]
        )
    ) { // 其次使用form
      
      return {
        required: appForm.required,
        rule: hostPropsIsArray
          ? appForm.rules[hostProps[hostProps.length - 1]] // props为数组时，取末端字符去rules里找
          : appForm.rules[hostProps]
      }
    } else {
      return false
    }
  }

  // 本项的校验提示信息
  let noPassMessage = ref('');
  // (validate 开始校验)
  const validate = () => {
    return new Promise((resolve) => {
      // (通过-回调)
      const success = () => {
        noPassMessage.value = ''
        resolve({ isSuccess: true })
      }

      // (不通过-回调)
      const noSuccess = (message) => {
        noPassMessage.value = message;
        resolve({ 
          isSuccess: false,
          message,
          node: appFormItem.getNode()
        })
      }

      const requiredRule = getRequiredRule()
      if (requiredRule) {
        const { required, rule } = requiredRule;
        customCheck({
          value: ficValue.value,
          required,
          rule,
          type,
          keywords: appFormItem.label
        })
          .then(success)
          .catch(noSuccess)
      } else {
        success()
      }
    })
  }
  // 本项是否有有效校验
  const isValidateEffective = computed(() => {
    const requiredRule = getRequiredRule();
    return requiredRule && (requiredRule.required || requiredRule.rule)
  })

  /**
   * 获取占位符
   */
  const getPlaceholder = (type) => {
    return props.placeholder 
      ? props.placeholder 
      : `${type === 'select' ? '请选择' : '请输入'}${appFormItem.label}`
    // return this.$_appFormItem_read ?
    //   '暂无' :
    //   this.$_appFormItem_placeholder ?
    //   this.$_appFormItem_placeholder :
    //   this.$options.type == "select" ?
    //   `请选择${this.$_appFormItem_label}` :
    //   `请输入${this.$_appFormItem_label}`
  }
  
  // 向上级组件报到，并拿到upOn
  const upOn = checkIn({
    port: FIC_PROT,
    uid: currentInstance.uid,
    type,
    context: {
      validate,
      isValidateEffective,
      noPassMessage,
      hostProps,
      hostPropsIsArray
    }
  })

  return {
    ficValue,
    placeholder: getPlaceholder(type),
    upOn
  }
}




