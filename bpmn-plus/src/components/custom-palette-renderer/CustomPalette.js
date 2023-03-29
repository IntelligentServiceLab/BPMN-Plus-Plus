export default class CustomPalette {  // 定义一个类
    constructor(bpmnFactory, create, elementFactory, palette, translate) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        palette.registerProvider(this);  // 在类中使用palette.registerProvider(this)指定这是一个palette
    }

    // 这个函数就是绘制palette的核心
    getPaletteEntries(element) {  // 函数的名称你不能变, 不然会报错, 首先它返回的是一个对象, 对象中指定的就是你要自定义的项
        const {
            bpmnFactory,
            create,
            elementFactory,
            translate
        } = this;

        function createCustomTask(CustomTask) {
            return function (event) {
                const businessObject = bpmnFactory.create('bpmn:Task');  // 这个可以选择其他e.element.type的元素
                businessObject['CustomElement'] = CustomTask;
                const shape = elementFactory.createShape({
                    type: 'bpmn:Task',
                    businessObject
                });
                create.start(event, shape);
            }
        }

        return {
            'create.ImageTask': {
                group: 'customTask',  // 分组名，比如tools、event、gateway、activity等等,用于分类
                className: 'icon-custom ImageTask',  // 样式类名，我们可以通过它给元素修改样式
                title: translate('Create ImageTask'),  //  鼠标移动到元素上面给出的提示信息
                action: {  // 用户操作时会触发的事件
                    dragstart: createCustomTask('ImageTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('ImageTask')  // 点击时调用的事件
                }
            },
            'create.IndustrialRobotsTask': {
                group: 'customTask',
                className: 'icon-custom IndustrialRobotsTask',
                title: 'Create IndustrialRobotsTask',
                action: {
                    dragstart: createCustomTask('IndustrialRobotsTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('IndustrialRobotsTask')  // 点击时调用的事件
                }
            },
            'create.SensorTask': {
                group: 'customTask',
                className: 'icon-custom SensorTask',
                title: 'Create SensorTask',
                action: {
                    dragstart: createCustomTask('SensorTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('SensorTask')  // 点击时调用的事件
                }
            },
            'create.AudioTask': {
                group: 'customTask',
                className: 'icon-custom AudioTask',
                title: 'Create AudioTask',
                action: {
                    dragstart: createCustomTask('AudioTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('AudioTask')  // 点击时调用的事件
                }
            },
            'create.CollectTask': {
                group: 'customTask',
                className: 'icon-custom CollectTask',
                title: 'Create CollectTask',
                action: {
                    dragstart: createCustomTask('CollectTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('CollectTask')  // 点击时调用的事件
                }
            },
            'create.PrivacyTask': {
                group: 'customTask',
                className: 'icon-custom PrivacyTask',
                title: 'Create PrivacyTask',
                action: {
                    dragstart: createCustomTask('PrivacyTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('PrivacyTask')  // 点击时调用的事件
                }
            },
            'create.IntelligentTask': {
                group: 'customTask',
                className: 'icon-custom IntelligentTask',
                title: 'Create IntelligentTask',
                action: {
                    dragstart: createCustomTask('IntelligentTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('IntelligentTask')  // 点击时调用的事件
                }
            },
            'create.TransportTask': {
                group: 'customTask',
                className: 'icon-custom TransportTask',
                title: 'Create TransportTask',
                action: {
                    dragstart: createCustomTask('TransportTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('TransportTask')  // 点击时调用的事件
                }
            },
            'create.DeliveryTask': {
                group: 'customTask',
                className: 'icon-custom DeliveryTask',
                title: 'Create DeliveryTask',
                action: {
                    dragstart: createCustomTask('DeliveryTask'),   // 开始拖拽时调用的事件
                    click: createCustomTask('DeliveryTask')  // 点击时调用的事件
                }
            },
            'create.DataGateWay': {
                group: 'customTask',
                className: 'icon-custom DataGateWay',
                title: 'Create DataGateWay',
                action: {
                    dragstart: createCustomTask('DataGateWay'),   // 开始拖拽时调用的事件
                    click: createCustomTask('DataGateWay')  // 点击时调用的事件
                }
            },

        }
    }
}

CustomPalette.$inject = [  // 使用$inject注入一些需要的变量
    'bpmnFactory',
    'create',
    'elementFactory',
    'palette',
    'translate'
]