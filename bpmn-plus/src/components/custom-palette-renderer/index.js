import CustomPalette from './CustomPalette';  // 自定义画板palette
import CustomRenderer from './CustomRenderer';  // 自定义元素渲染

// 注:️ 这里__init__中的名字就必须是customPalette了, 还有下面的属性名也必须是customPalette, 不然就会报错了.
// 注意: __init__中的属性命名customRenderer都是固定的写法不能修改, 不然就会没有效果
export default {
    __init__: ['customPalette', 'customRenderer'],
    customPalette: ['type', CustomPalette],
    customRenderer: ['type', CustomRenderer]
}