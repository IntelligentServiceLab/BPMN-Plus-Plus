<template>
  <div class="containers" ref="content">

    <div class="canvas" id="drop_zone" ref="canvas" tabindex="0"></div>

    <properties-view v-if="bpmnModeler" :modeler="bpmnModeler"></properties-view>
    <ul class="buttons">
      <li>
        <a href="javascript:" id="file-upload" title="open BPMN diagram from local file system" class="active">
          <img src="../assets/icon_upload.png" alt="" style="width:22px; height: 22px">
          <input type="file" id="file-input" style="display:none;">
        </a>
      </li>
      <li>
        <a href="javascript:" id="carete-new-bpmn" title="create new BPMN diagram" class="active">
          <img src="../assets/icon_create.png" alt="" style="width:22px; height: 22px">
        </a>
      </li>
      <li>
        <a ref="saveDiagram" href="javascript:" id="download-bpmn" class="active" title="Download as BPMN 2.0 file">
          <img src="../assets/icon_download.png" alt="" style="width:22px; height: 22px">
        </a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" id="download-svg" class="active" title="Download as SVG image">
          <img src="../assets/icon_picture.jpg" alt="" style="width:22px; height: 22px">
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler';  // 这个用来建模
import PropertiesView from './custom-properties-panel/PropertiesView';  // 自定义的 右侧属性栏 (框+内容)
import customPaletteAndRenderer from './custom-palette-renderer/index.js';  // 自定义左侧工具栏元素 + 渲染
import MRfieldDescriptor from '../descriptors/mrfield';  // 自定义的右侧扩展属性描述json
import MultiInstanceDescriptor from '../descriptors/MultiInstance';
import CustomElementDescriptor from '../descriptors/customElement';
import { xmlStr } from '../mock/xmlStr';   // 引入一个本地的xml字符串
import { NewxmlStr } from '../mock/NewxmlStr';   // 引入一个本地的xml字符串
import $ from 'jquery';

export default {
  name: 'BpmnPlus',
  components: {
    PropertiesView  // 自定义的 右侧属性栏
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() { },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.init();
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: xmlStr,
      xmlStatus_Undo: [],
      xmlStatus_Redo: [],
      selectedElements: [],  // 当前选择的元素集合
      element: null,  // 当前点击的元素
      CopyElement: {},  // Ctrl+c准备复制的元素
      pressed_keys: new Set(),  // 按键去重
    }
  },
  // 方法集合
  methods: {
    init() {
      this.container = this.$refs.content;  // 获取到属性ref为“content”的dom节点
      const canvas = this.$refs.canvas;  // 获取到属性ref为“canvas”的dom节点

      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        additionalModules: [  // 自定义左侧工具栏元素 + 渲染
          customPaletteAndRenderer
        ],
        moddleExtensions: {  // 自定义的维护属性面板中的属性
          MRfield: MRfieldDescriptor,
          MultiInstance: MultiInstanceDescriptor,
          CustomElement: CustomElementDescriptor
        }
      });
      this.createNewDiagram();
    },

    async createNewDiagram() {
      // 将字符串转换成图显示出来
      try {
        await this.bpmnModeler.importXML(this.xmlStr);
        this.success();
      } catch (err) {
        console.log(err.message, err.warnings);
      }
    },

    success() {
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.addBpmnListener();     // 保存图片、bpmn文件用
      this.addEventBusListener();  // 监听element并绑定事件
      this.uploadXML();  // 导入XML文件
      this.addbtn2createNewBpmnDiagram();  // 创建新的BPMN Diagram
      this.addkeyboardListener();  // 加入键盘监听
      this.addDropListener();  // 加入拖放文件监听
    },
    addDropListener() {
      const outer = this;
      // 获取要接受拖放的区域元素
      const dropZone = document.getElementById('drop_zone');

      // 绑定拖放事件
      dropZone.addEventListener('dragover', handleDragOver, false);
      dropZone.addEventListener('drop', handleFileSelect, false);

      function handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // 设置拖放效果为拷贝
      }

      function handleFileSelect(event) {
        event.stopPropagation();
        event.preventDefault();

        const files = event.dataTransfer.files; // 获取拖放的文件列表
        if (files.length > 0) {
          const file = files[0];
          if (file.name.split('.')[1] !== 'bpmn') { // 如果上传的不是bpmn文件，则直接返回
            alert("上传文件格式有误, 请上传xml格式的bpmn文件");
            return;
          }

          const reader = new FileReader();
          reader.readAsText(file); // 读取文件内容
          reader.onload = async () => {
            const xml = reader.result;
            await outer.bpmnModeler.importXML(xml);
            outer.xmlStr = xml;
            outer.xmlStatus_Undo.length = 0;
            outer.xmlStatus_Redo.length = 0;
          };
        }
      }
    },

    addbtn2createNewBpmnDiagram() {
      $('#carete-new-bpmn').on('click', async e => {
        await this.bpmnModeler.importXML(NewxmlStr);
        this.xmlStr = NewxmlStr;
        this.xmlStatus_Undo.length = 0;
        this.xmlStatus_Redo.length = 0;
      });
    },
    uploadXML() {
      const outer = this;
      document.getElementById('file-upload').addEventListener('click', () => {
        document.getElementById('file-input').click();
      });

      document.getElementById('file-input').addEventListener('change', () => {
        const input = document.getElementById('file-input');
        const file = input.files[0];
        input.value = '';    // 重置输入字段,使得上传相同文件名的文件时也会有响应

        // 如果用户在上传文件的时候点了取消，即文件为空时，或者上传的不是bpmn文件，则直接返回
        if (!file || file.name.split('.')[1] !== 'bpmn') {
          alert("上传文件格式有误, 请上传xml格式的bpmn文件");
          return;
        }

        const reader = new FileReader();
        reader.readAsText(file);  // 读取文件内容
        reader.onload = async () => {
          const xml = reader.result;
          await outer.bpmnModeler.importXML(xml);
          outer.xmlStr = xml;
          outer.xmlStatus_Undo.length = 0;
          outer.xmlStatus_Redo.length = 0;
        };
      });
    },

    addkeyboardListener() {
      const outer = this;

      const $canvas = $('.canvas');
      $canvas.keydown(e => {  // 键盘按住时（不松起）
        outer.pressed_keys.add(e.key);
        outer.KeyboardShortcuts(e);
      });

      $canvas.keyup(e => {  // 键盘松开时
        outer.pressed_keys.delete(e.key);
      });
    },

    /**
     * 删除传入的一个key列表
     * @param {List} keys : 传入的keys是一个key列表
     */
    deletePressed_keys(keys) {
      for (let key of keys) {
        this.pressed_keys.delete(key);
      }
    },
    // 键盘快捷键操作函数
    async KeyboardShortcuts(e) {
      const modeling = this.bpmnModeler.get('modeling');
      const elementFactory = this.bpmnModeler.get('elementFactory');
      const bpmnFactory = this.bpmnModeler.get('bpmnFactory');
      const create = this.bpmnModeler.get('create');

      // console.log(this.pressed_keys);
      if (this.pressed_keys.has('Control')) {
        e.preventDefault();  // 如果按了Ctrl就禁用浏览器的默认快捷键行为
        if (this.pressed_keys.has('Shift')) {
          if (this.pressed_keys.has('z') || this.pressed_keys.has('Z')) {  // Ctrl+Shift+z: Redo
            if (this.xmlStatus_Redo.length == 0) {
              this.deletePressed_keys(['z', 'Z']);
              return;
            }
            let xml = this.xmlStatus_Redo.pop();  // 从Redo中取出需要重做的xml的状态
            await this.bpmnModeler.importXML(xml);
            this.xmlStatus_Undo.push(this.xmlStr);
            this.xmlStr = xml;  // 更新当前xml状态
            this.deletePressed_keys(['z', 'Z']);
            return;
          }
        } else if (this.pressed_keys.has('z') || this.pressed_keys.has('Z')) {  // Ctrl+z: Undo
          if (this.xmlStatus_Undo.length == 0) {
            this.deletePressed_keys(['z', 'Z']);
            return;
          }
          let xml = this.xmlStatus_Undo.pop();  // 从Undo取出上一次xml的状态
          await this.bpmnModeler.importXML(xml);
          this.xmlStatus_Redo.push(this.xmlStr);  // 加入Redo的栈中
          this.xmlStr = xml;  // 更新当前xml状态
          this.deletePressed_keys(['z', 'Z']);
          return;
        } else if (this.pressed_keys.has('c') || this.pressed_keys.has('C')) {  // Ctrl+c: Copy
          if (!this.element || this.element.type === "bpmn:SequenceFlow" || this.element.type === "label") {
            this.deletePressed_keys(['c', 'C']);
            return;
          }
          let { type, businessObject } = this.element;
          this.CopyElement = {
            "type": type,
            "businessObject": businessObject,
          }
          // console.log("ctrl+c, 将当前选中的element复制下来:", this.CopyElement);
          this.deletePressed_keys(['c', 'C']);
          return;
        } else if (this.pressed_keys.has('v') || this.pressed_keys.has('V')) {  // Ctrl+v: Paste
          if (!this.CopyElement['type']) {
            this.deletePressed_keys(['v', 'V']);
            return;
          }
          const type = this.CopyElement['type'];
          const { name, mrfield_list, $attrs, CustomElement, loopCharacteristics, InstanceNumber, EndCondition, ConditionNum, ConditionTime } = this.CopyElement['businessObject'];
          const businessObject = bpmnFactory.create(type, { ...$attrs });
          businessObject['name'] = name;
          if (mrfield_list) {
            businessObject['mrfield_list'] = mrfield_list;
          }
          if (CustomElement) {
            businessObject['CustomElement'] = CustomElement;
          }
          if (loopCharacteristics) {
            businessObject['loopCharacteristics'] = loopCharacteristics;
          }
          if (InstanceNumber) {
            businessObject['InstanceNumber'] = InstanceNumber;
          }
          if (EndCondition) {
            businessObject['EndCondition'] = EndCondition;
          }
          if (ConditionNum) {
            businessObject['ConditionNum'] = ConditionNum;
          }
          if (ConditionTime) {
            businessObject['ConditionTime'] = ConditionTime;
          }

          const shape = elementFactory.createShape({
            type: type,
            businessObject
          });
          const event = new MouseEvent("click", {  // 创建一个鼠标点击事件对象
            view: window,
            bubbles: true,
            cancelable: true
          });

          create.start(event, shape);
          this.deletePressed_keys(['v', 'V']);
          return;
        }
      } else if (this.pressed_keys.has('Delete')) {
        if (this.selectedElements.length == 0) {
          this.deletePressed_keys(['Delete']);
          return;
        }
        let deleteElementList = [...this.selectedElements];  // 把所有选中的元素加入待删除的List中
        modeling.removeElements(deleteElementList);
        this.deletePressed_keys(['Delete']);
        return;
      }
    },

    // 监听选中的element
    addEventBusListener() {
      this.bpmnModeler.on('selection.changed', e => {
        this.selectedElements = e.newSelection;  // 数组，可能有多个（Windows下按住Ctrl可以选多个元素）
        this.element = e.newSelection[0];  // 默认取第一个
        // console.log("当前点击的元素:", this.element);
      });
    },

    // 添加绑定事件
    async addBpmnListener() {
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', async () => {
        const newXml = await this.saveDiagram();
        // console.log("xml更新");  // 将最新的xml信息打印出来
        this.xmlStatus_Undo.push(this.xmlStr);  // 将old的xml状态压入栈中
        this.xmlStr = newXml;  // 更新当前xml的状态
      });

      // 获取a标签dom节点
      const downloadBPMNLink = this.$refs.saveDiagram;  // 保存为xml的按钮
      const downloadSvgLink = this.$refs.saveSvg;  // 保存为svg的按钮
      $('#download-bpmn').on('click', async () => {
        const newXml = await this.saveDiagram();
        this.setEncoded(downloadBPMNLink, 'diagram.bpmn', newXml);
      })

      $('#download-svg').on('click', async () => {
        const svg = await this.saveSVG();
        this.setEncoded(downloadSvgLink, 'diagram.svg', svg);
      })
    },

    // 在saveDiagram和saveSVG中使用Promise而不是回调
    async saveDiagram() {
      // 这里获取到的就是最新的xml信息
      const { xml } = await this.bpmnModeler.saveXML({ format: true });
      return xml;
    },
    async saveSVG() {
      // 这里获取到的就是最新的svg信息
      const { svg } = await this.bpmnModeler.saveSVG({});
      return svg;
    },

    /**
     * 当图发生改变的时候会调用这个函数
     * @param { HTMLElement } link - 点击的按钮
     * @param { string } name - 保存的文件名字
     * @param { string } data - 图的xml
     */
    setEncoded(link, name, data) {
      const encodedData = encodeURIComponent(data);  // 把xml、svg转换为URI，下载要用到的
      // 下载图的具体操作,改变link的属性
      if (data) {
        link.className = 'active';  // className令link标签可点击
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;  // href令能下载
        link.download = name;  // download是下载的文件的名字
      }
    },
  },
  // 计算属性
  computed: {}
}
</script>

<style scoped>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
}

.canvas {
  width: 100%;
  height: 100%;
}

/* 画布聚焦时隐藏外面的框框 */
.canvas:focus {
  outline: none;
}

.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}

.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
}


.buttons li {
  display: inline-block;
  margin: 5px;
}

.buttons li a {
  color: #999;
  background: #eee;
  cursor: not-allowed;
  padding: 8px;
  border: 1px solid #ccc;
  text-decoration: none;
}

.buttons li a.active {
  color: #333;
  background: #fff;
  cursor: pointer;
}
</style>