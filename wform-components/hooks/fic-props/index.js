/**
 * fic-props.js app-fi-*组件通用的props
 */

const props = {
  /**
   * 关于数据的配置
   * {
   *   props: ''
   * }
   */
  fiConfig: {
    type: Object,
    default: () => ({})
  },
  placeholder: {}
}

export default function getUniversalProps(names = []) {
  let newProps = {};
  names.forEach(name => {
    if(props[name]) newProps[name] = props[name]
  })
  return newProps;
}
