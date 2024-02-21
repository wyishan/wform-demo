// getType 检验数据类型
export function getType(value) {
	return Object.prototype.toString.call(value).replace(/\[object |\]/g, '').toLowerCase();
}
// isHave type=undefind || type=null 返回true
export function isHave(value) {
	return value !== undefined && value !== null;
}
// isUndef type=undefind 返回true
export function isUndef(value) {
	return value === undefined;
}
// isNumber type=number 返回true
export function isNumber(value) {
	return getType(value) === 'number';
}
// isObject type=object 返回true
export function isObject(value) {
	return getType(value) === 'object';
}
// isArray type=array 返回true
export function isArray(value) {
	return Array.isArray(value);
}
// isString type=string 返回true
export function isString(value) {
	return typeof value == 'string';
}
// isFun type=function 返回true
export function isFun(value) {
	return getType(value) === 'function';
}
// isTypeEtc 两值类型相等 返回true
export function isTypeEtc(valueOne, valueTwo) {
	return getType(valueOne) == getType(valueTwo);
}

// getPropsParent 获取props的上一层数据
// export function getPropsParent(model,props) {
//   if (getType(props) == "array") {
//     const propsClone = [...props];
//     propsClone.pop()
//     return getPropsValue(model,propsClone);
//   } else {
//     return model[props];
//   }
// }

/**
 * getPropsValue 获取路径在数据源中的值
 * @param {Object} model 
 * @param {Array<Steing>} props 
 * @returns {Any}
 */
export function getPropsValue(model, props, index = 0) {
  if(props.length === 0) return ''

	if (props.length > index + 1) {
		return getPropsValue(model[props[index]], props, ++index);
	} else {
		return model[props[index]];
	}
}

/**
 * getPropsParentLayer 获取路径数组在数据中的上一层数据
 * @param {Object} model 
 * @param {Array<Steing>} props 
 * @returns {Any}
 */
export function getPropsParentLayer(model, props, index = 0) {
  if (props.length === 1) {
    // *长度为1直接返回传入的数据
    return model;
  } else {
    // 将props尾部切掉一个，即可获取其上级的props
    const parentProps = [...props].slice(0,-1);
    return getPropsValue(model,parentProps);
  }
}

/**
 * queryTree 将一串key的节点从树状数据中找出
 * @param {Array} key数组
 * @param {Array} 树状数据
 * @param {Array} 树状数据中的key,一般为id
 */
export function queryTree(keys, nodes, nodesKey, collect = [], index = 0) {
	let findRes = nodes.find(i => i[nodesKey] == keys[index]);
	if (findRes) collect.push(findRes);
	if (findRes.children && findRes.children.length) {
		return queryTree(keys, findRes.children, nodesKey, collect, ++index);
	} else {
		return collect;
	}
}