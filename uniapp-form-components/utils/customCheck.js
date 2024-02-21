import { isObject, isArray } from './functions'
import Schema from '../libs/async-validator'

export default ({ value, required, rule = [], type,  keywords }) => {
  if(isObject(rule)) rule = [rule] // rule为json的情况
  
  return new Promise(((resolve,reject) => {
    
    if (required || rule.length) {
      if(!isArray(rule)) {
        console.warn(`无效rule：“${rule}”，rule必须为一个数组或者对象。`);
        return resolve()
      }
  
      if(required) {
        // * 添加required
        // #待开发--请选择
        let message = `${type === 'select' ? '请选择' : '请输入'}${keywords}`
        rule.unshift({ required: true, message });
      }
  
      // 将pattern字段从String转为RegExp(正则类型)
      const ruleMap = rule.map(i => {
        const iClone = {...i}
        if(iClone.pattern) iClone.pattern = new RegExp(iClone.pattern)
        return iClone;
      })
  
      const schemaVm = new Schema({
        item: ruleMap
      });
      schemaVm.validate({
        item: value
      })
        .then(resolve)
        .catch(({ fields }) => {
          reject(fields.item[0]?.message)
        })
    } else {
      // * 无需校验，直接通过
      resolve()
    }
  }))
}