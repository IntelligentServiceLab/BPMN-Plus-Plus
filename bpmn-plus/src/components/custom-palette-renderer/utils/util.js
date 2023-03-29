const customElements = [  // 自定义元素的类型
    'bpmn:Task',
]

const customConfig = { // 自定义元素的配置
    'bpmn:Task': {
        'ImageTask': {
            'url': require('@/assets/ImageTask.png'),
        },
        'IndustrialRobotsTask': {
            'url': require('@/assets/IndustrialRobotsTask.png'),
        },
        'SensorTask': {
            'url': require('@/assets/SensorTask.png'),
        },
        'AudioTask': {
            'url': require('@/assets/AudioTask.png'),
        },
        'CollectTask': {
            'url': require('@/assets/CollectTask.png'),
        },
        'PrivacyTask': {
            'url': require('@/assets/PrivacyTask.png'),
        },
        'IntelligentTask': {
            'url': require('@/assets/IntelligentTask.jpg'),
        },
        'TransportTask': {
            'url': require('@/assets/TransportTask.png'),
        },
        'DeliveryTask': {
            'url': require('@/assets/DeliveryTask.svg'),
        },
        'DataGateWay': {
            'url': require('@/assets/DataGateWay.svg'),
        },
        'attr': { x: 0, y: 0, width: 48, height: 48 }
    },
}

const hasLabelElements = [  // 一开始就有label标签的元素类型，不需要重新渲染
    'bpmn:StartEvent',
    'bpmn:EndEvent'
]

export {
    customElements,
    customConfig,
    hasLabelElements
}