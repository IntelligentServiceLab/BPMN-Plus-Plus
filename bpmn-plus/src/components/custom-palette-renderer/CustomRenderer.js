import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';   // 引入默认的renderer
// 由于是在bpmn.js已有的元素上进行修改, 所以首先我们可以先将BaseRenderer这个类引入进来, 然后让我们的自定义renderer继承它:

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg';
import { customElements, customConfig, hasLabelElements } from './utils/util';

// 注: 这里有个小坑要注意一下, 就是HIGH_PRIORITY不能够去掉, 不然的话你会发现它不会执行下面的drawShpe函数
const HIGH_PRIORITY = 1500;  // 最高优先级

export default class CustomRenderer extends BaseRenderer {  // 继承BaseRenderer
    constructor(eventBus, bpmnRenderer, modeling) {
        super(eventBus, HIGH_PRIORITY);
        this.bpmnRenderer = bpmnRenderer;
        this.modeling = modeling;
    }

    canRender(element) {
        return !element.labelTarget;  // 忽略标签
    }

    drawShape(parentNode, element) {  // 核心函数就是绘制shape
        const type = element.type; // 获取到类型
        const customElement = element.businessObject['CustomElement'];
        if (customElements.includes(type) && customElement) { // or customConfig[type]
            const { attr } = customConfig[type];
            const { url } = customConfig[type][customElement]
            //实现让页面渲染出自己想要的效果的做法就是使用svgCreate方法创建一个image并添加到父节点中
            const customIcon = svgCreate('image', {
                ...attr,
                href: url,
            })
            element['width'] = attr.width; // 这里我是取了巧, 直接修改了元素的宽高
            element['height'] = attr.height;
            svgAppend(parentNode, customIcon);

            // 判断是否有name属性来决定是否要渲染出label
            if (!hasLabelElements.includes(type) && element.businessObject.name) {
                const text = svgCreate('text', {
                    x: attr.x + 5,
                    y: attr.y + attr.height + 20,
                    "font-size": "16",
                    "fill": "#000"
                })
                text.innerHTML = element.businessObject.name;

                svgAppend(parentNode, text);
            }
            return customIcon;
        }
        const shape = this.bpmnRenderer.drawShape(parentNode, element);
        return shape;
    }

    getShapePath(shape) {
        return this.bpmnRenderer.getShapePath(shape);
    }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer', 'modeling'];