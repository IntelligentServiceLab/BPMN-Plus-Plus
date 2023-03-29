<template>
  <div class="custom-properties-panel" v-if="selectedElements.length == 1">
    <fieldset class="element-item">
      <label>id</label>
      <span>{{ element.id }}</span>
    </fieldset>
    <fieldset class="element-item">
      <label>name</label>
      <input class="form-control" :value="element.name" @change="event => changeField(event, 'name')" />
    </fieldset>

    <fieldset class="element-item">
      <label>Set Color</label>
      <div class="row ms-4">
        <div class="col-5">
          <span>fill</span>
          <input class="form-control" type="color" :value="element.di.fill ? element.di.fill : '#ffffff'"
            @change="event => SetColor(event, 'fill')" />
        </div>
        <div class="col-5">
          <span>stroke</span>
          <input class="form-control" type="color" :value="element.di.stroke ? element.di.stroke : '#000000'"
            @change="event => SetColor(event, 'stroke')" />
        </div>
      </div>
    </fieldset>

    <fieldset class="element-item" v-if="isEvent">
      <label>Event Type</label>
      <select class="form-select" @change="changeEventType" :value="eventType">
        <option v-for="option in eventTypes" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </fieldset>

    <fieldset class="element-item" v-if="isTask">
      <label>Task Type</label>
      <select class="form-select" @change="changeTaskType" :value="taskType">
        <option v-for="option in taskTypes" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </fieldset>

    <fieldset class="element-item" v-if="isMultiInstance">
      <label>InstanceNumber</label>
      <input class="form-control" :value="InstanceNumber ? InstanceNumber : 'None'"
        @change="event => update_InstanceNuber(event, 'InstanceNumber')" />
    </fieldset>

    <fieldset class="element-item" v-if="isMultiReceiveTask">
      <label>EndCondition</label>
      <select class="form-select" @change="changeEndConditionType" :value="EndConditionType">
        <option v-for="option in EndConditionTypes" :key="option.value" :value="option.value">{{ option.label }}
        </option>
      </select>
      <fieldset class="element-item mt-2" v-if="EndConditionType === 'Number' || EndConditionType === 'Race'">
        <label>ConditionNum</label>
        <input class="form-control" :value="ConditionNum ? ConditionNum : InstanceNumber"
          @change="event => update_ConditionNum(event, 'ConditionNum')" />
      </fieldset>
      <fieldset class="element-item mt-2" v-if="EndConditionType === 'Time' || EndConditionType === 'Race'">
        <label>ConditionTime</label>
        <input class="form-control" :value="ConditionTime"
          @change="event => update_ConditionTime(event, 'ConditionTime')" />
      </fieldset>
    </fieldset>

    <div class="card mt-2" v-if="isDataReference || isSendOrReceiveTask">
      <div class="card-body">
        <div class="card-title">
          <label v-if="isDataReference">Add Data Field</label>
          <label v-if="isSendOrReceiveTask">Add Message Field</label>
          <div class="btn btn-outline-primary btn-sm ms-2" @click="add_expansion_data">+</div>
        </div>
        <div class="card-text">
          <div class="row mt-2" v-for="(value, key) in DataFields_dict" :key="key">
            <div class="col-5">
              <input type="text" class="form-control" placeholder="key" :value="key"
                @change="event => update_expansion_data_key(event, key, value)" />
            </div>
            <div class="col-5">
              <input type="text" class="form-control" placeholder="value" :value="value"
                @change="event => update_expansion_data(event, key)" />
            </div>
            <div class="col-2">
              <div class="btn btn-sm btn-outline-danger" @click="delete_expansion_data(key)">×</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-2" v-if="isSendOrReceiveTask">
      <div class="card-body">
        <div class="card-title">
          <label>Add MessageRelation</label>
          <div class="btn btn-outline-primary btn-sm ms-2" @click="add_mrfield_group">+</div>
        </div>

        <div class="card-text">
          <div class="row mt-2" v-for="(MRField, groupName) in MRField_dict" :key="groupName">
            <div class="col-6">
              <input type="text" class="form-control" placeholder="MRField" :value="groupName"
                @change="event => update_MRField_GroupName(event, groupName)" />
            </div>
            <div class="col-3">
              <div class="dropdown">
                <button type="button" class="btn btn-outline-primary dropdown-toggle btn-sm" data-bs-toggle="dropdown">
                  +
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#"
                      v-for="(DataFields_dict_value, DataFields_dict_key) in DataFields_dict" :key="DataFields_dict_key"
                      @click="add_mrfield_item(groupName, DataFields_dict_key, DataFields_dict_value)">
                      {{ DataFields_dict_key }}：{{ DataFields_dict_value }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-2">
              <div class="btn btn-outline-danger btn-sm" @click="delete_mrfield_group(groupName)">×</div>
            </div>

            <div class="row" v-for="(MRField_item, MRField_item_key) in MRField" :key="MRField_item_key">
              <div class="col-10">
                <p class="h6 small mark" style="float:left">{{ MRField_item_key }}：{{ MRField_item }}</p>
              </div>
              <div class="col-1">
                <div class="btn btn-outline-danger btn-sm" style="float:left"
                  @click="delete_mrfield_item(groupName, MRField_item_key)">×
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg';

export default {
  name: 'PropertiesView',
  props: {
    modeler: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      selectedElements: [],  // 当前选择的元素集合
      element: null,  // 当前点击的元素
      eventTypes: [
        { label: '默认', value: '' },
        { label: 'MessageEventDefinition', value: 'bpmn:MessageEventDefinition' },
        { label: 'TimerEventDefinition', value: 'bpmn:TimerEventDefinition' },
        { label: 'ConditionalEventDefinition', value: 'bpmn:ConditionalEventDefinition' },
        { label: 'SignalEventDefinition', value: 'bpmn:SignalEventDefinition' },
      ],
      eventType: '',
      taskTypes: [
        { label: 'Task', value: 'bpmn:Task' },
        { label: 'Send Task', value: 'bpmn:SendTask' },
        { label: 'Receive Task', value: 'bpmn:ReceiveTask' },
        { label: 'User Task', value: 'bpmn:UserTask' },
        { label: 'Manual Task', value: 'bpmn:ManualTask' },
        { label: 'Business Rule Task', value: 'bpmn:BusinessRuleTask' },
        { label: 'ServiceTask', value: 'bpmn:ServiceTask' },
      ],
      taskType: '',

      key_id: 1,
      DataFields_dict: {},
      MRField_dict: {},
      InstanceNumber: null,
      EndConditionTypes: [
        { label: '', value: '' },
        { label: 'Number', value: 'Number' },
        { label: 'Time', value: 'Time' },
        { label: 'Race', value: 'Race' },
      ],
      EndConditionType: '',
      ConditionNum: null,
      ConditionTime: null,
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { modeler } = this;  // 父组件传递进来的modeler

      // selection.changed 监听选中的元素
      modeler.on('selection.changed', e => {
        this.selectedElements = e.newSelection;  // 数组，可能有多个（Windows下按住Ctrl可以选多个元素）
        this.element = e.newSelection[0];  // 默认取第一个
        this.setDefaultProperties();  // 设置一些默认的值
      });

      // element.changed 监听发生改变的元素
      modeler.on('element.changed', e => {
        const { element } = e;
        const { element: currentElement } = this;
        if (!currentElement) {
          return
        }
        // update panel, if currently selected element changed
        if (element.id === currentElement.id) {
          this.element = element
        }
      })
    },

    setDefaultProperties() {
      // const { element } = this 等价于const element = this.element, 好处是可以直接使用element了
      const { element } = this;
      if (element) {
        // 这里可以拿到当前点击的节点的所有属性
        const { type, businessObject } = element;
        const { name } = businessObject;
        if (this.verifyIsEvent(type)) {
          this.eventType = businessObject.eventDefinitions ? businessObject.eventDefinitions[0]['$type'] : ''
        } else if (this.verifyIsTask(type)) {
          this.taskType = type
        }
        element['name'] = name;  // 同步更新图上的label和自定义属性栏的name

        this.ConditionNum = businessObject.ConditionNum;
        this.ConditionTime = businessObject.ConditionTime;
      }
    },
    updateName(name) {
      const { modeler, element } = this
      const modeling = modeler.get('modeling')
      modeling.updateLabel(element, name)
      // 等同于 modeling.updateProperties(element, { name })
    },

    changeEventType(event) {  // 改变下拉框
      const { modeler, element } = this
      const value = event.target.value;  // 当前下拉框选择的值
      const bpmnReplace = modeler.get('bpmnReplace')
      this.eventType = value
      bpmnReplace.replaceElement(element, {
        type: element.businessObject.$type,
        eventDefinitionType: value  // 修改type
      })
    },
    changeTaskType(event) {
      const { modeler, element } = this
      const value = event.target.value;  // 当前下拉框选择的值
      const bpmnReplace = modeler.get('bpmnReplace')
      bpmnReplace.replaceElement(element, {
        type: value  // 直接修改type就可以了
      })
    },

    verifyIsEvent(type) {  // 判断类型是不是event
      return type.includes('Event') && type !== "bpmn:EventBasedGateway"
    },

    verifyIsTask(type) {  // 判断类型是不是task
      if (type.includes('Task')) {
        return true;
      }
      return false;
    },
    verifyIsDataReference(type) {  // 判断类型是不是bpmn:DataObjectReference、bpmn:DataStoreReference
      if (type === "bpmn:DataObjectReference" || type === "bpmn:DataStoreReference") {
        this.read_expansion_data();
        return true;
      }
      return false;
    },
    verifyIsSendOrReceiveTask(type) {
      if (type == "bpmn:SendTask" || type == "bpmn:ReceiveTask") {
        this.read_expansion_data();  // 读取额外数据
        this.read_MessageRelation();  // 读取MessageRelation
        return true;
      }
      return false;
    },

    // 用于读取扩展的数据
    read_expansion_data() {
      for (let key in this.DataFields_dict) {  // 清空DataFields
        delete this.DataFields_dict[key];
      }
      let DataFields_backup_dict = this.element.businessObject.$attrs;  // 取出当前元素的附加属性
      for (let key in DataFields_backup_dict) {
        this.DataFields_dict[key] = DataFields_backup_dict[key];
      }
    },

    // 增加扩展数据field
    add_expansion_data() {
      Vue.set(this.DataFields_dict, `Key${this.key_id}`, `Value${this.key_id}`);  // 响应式给对象增加数据，页面也会重新渲染

      let key = `Key${this.key_id}`;
      let value = `Value${this.key_id}`;
      let properties = {}
      properties[key] = value;
      this.updateProperties(properties);  // 调用属性更新方法
      this.key_id++;
    },

    // 删除扩展数据field
    delete_expansion_data(key) {
      // console.log(`删除键为${key}的这条数据:`);
      Vue.delete(this.DataFields_dict, key);
      let properties = {}
      properties[key] = undefined;
      this.updateProperties(properties);  // 调用属性更新方法

      if (this.verifyIsSendOrReceiveTask(this.element.type)) {
        this.synchronous_delete_mrfield_item(key);  // 同步更新下面的MessageRelation
      }
    },

    // 更新扩展数据field的value
    update_expansion_data(event, key) {
      const value = event.target.value;
      let properties = {};
      properties[key] = value;
      this.updateProperties(properties);  // 调用属性更新方法

      if (this.verifyIsSendOrReceiveTask(this.element.type)) {
        this.synchronous_update_mrfield_item(key, value);  // 同步更新下面的MessageRelation
      }
    },

    // 更新扩展数据field的key
    // 修改key的思路，将value保存下来，先将原old_key、value对删除，再增加一个new_key、value对
    update_expansion_data_key(event, old_key, value) {
      const new_key = event.target.value;
      Vue.delete(this.DataFields_dict, old_key);
      let properties = {};
      properties[old_key] = undefined;
      properties[new_key] = value;
      this.updateProperties(properties);  // 调用属性更新方法

      this.synchronous_updateKey_mrfield_item(old_key, new_key, value);
    },

    // 用于读取MessageRelation
    read_MessageRelation() {
      for (let key in this.MRField_dict) {  // 清空MRField_dict
        Vue.delete(this.MRField_dict, key);
      }

      const businessObject = this.element.businessObject;
      if (businessObject.mrfield_list) {  // 如果有mrfield_list附加属性的话
        let mrfield_list = businessObject.mrfield_list.$attrs;  // 获取mrfield_list，里面存放的扩展的MRField组
        let mrfield_list_item = businessObject.mrfield_list;

        for (let key_i in mrfield_list) {  // 枚举每一个MRField组拿到组名以及组里面的对象
          let mrfGropuName = mrfield_list[key_i];  // mrfGropuName用户看到的MRField组名
          let mrfield_Keyname = key_i.split("_")[0];  // mrfield_Keyname存储在businessObject的组名
          Vue.set(this.MRField_dict, mrfGropuName, {});  // 响应式给对象增加数据，页面也会重新渲染

          for (let key_j in mrfield_list_item[`${mrfield_Keyname}`].$attrs) {
            let item_val = mrfield_list_item[`${mrfield_Keyname}`].$attrs[key_j]
            this.MRField_dict[mrfGropuName][key_j] = item_val;
          }
        }
      }
    },

    // 适用于Task，增加一个MessageRelation的Group
    add_mrfield_group() {
      let newGroupItem = 0;
      const { modeler, element } = this;
      const bpmnFactory = modeler.get('bpmnFactory');
      const businessObject = element.businessObject;

      if (!businessObject.mrfield_list) {  // 如果元素没有MessageRelation的话，给他开个新的
        let mrfield_list = bpmnFactory.create('mrfields:mrfield_list', {});
        businessObject.mrfield_list = mrfield_list;
      }

      for (let i = 1; i <= 10; i++) {  // 从1-10中找一个数字作为组的num来增加
        let mrfield_list = businessObject.mrfield_list.$attrs;
        let sign = true;
        for (let GroupName_key in mrfield_list) {
          if (GroupName_key.search(i) != -1) {  // 如果mrfield_list已经有了这个num就枚举下一个数字
            sign = false;
            break;
          }
        }
        if (sign) {  // 找到了合适的num就使用
          newGroupItem = i;
          break;
        }
      }

      let NewMrfieldGroup = bpmnFactory.create(`mrfields:mrfield${newGroupItem}`, {});  // 创建子元素
      businessObject.mrfield_list[`mrfield${newGroupItem}`] = NewMrfieldGroup;
      businessObject.mrfield_list.$attrs[`mrfield${newGroupItem}_name`] = `group${newGroupItem}`;

      this.read_MessageRelation();
    },

    // 适用于Task，删除一个MessageRelation的Group
    delete_mrfield_group(GroupName) {
      // console.log("删除组的名为：", GroupName);
      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        if (mrfield_list[i] === GroupName) {

          let mrfield_Keyname = i.split("_")[0];
          // console.log("当前的mrfield_Keyname是:", mrfield_Keyname);
          delete mrfield_list_item[mrfield_Keyname];
          delete mrfield_list[i];
          // console.log("删除完成");
        }
      }
      this.read_MessageRelation();
    },

    // 适用于Task，向MessageRelation里的其中一个Group增加一项额外数据item
    add_mrfield_item(GroupName, newKey, newValue) {
      // console.log("要增加item的组为：", GroupName);
      // console.log("要增加的项目为：", newKey, newValue);

      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        if (mrfield_list[i] === GroupName) {
          let mrfield_Keyname = i.split("_")[0];
          // console.log("当前的mrfield_Keyname是:", mrfield_Keyname);
          mrfield_list_item[mrfield_Keyname].$attrs[newKey] = newValue;
          // console.log("增加完成");
        }
      }
      this.read_MessageRelation();
    },

    // 适用于Task，删除MessageRelation里的其中一个Group的一项额外数据item
    delete_mrfield_item(GroupName, GroupItem) {
      // console.log("删除项目所在组为：", GroupName);
      // console.log("删除项目的名为：", GroupItem);

      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        if (mrfield_list[i] === GroupName) {
          let mrfield_Keyname = i.split("_")[0];
          // console.log("当前的mrfield_Keyname是:", mrfield_Keyname);
          delete mrfield_list_item[mrfield_Keyname].$attrs[GroupItem];
          // console.log("删除完成");
        }
      }
      this.read_MessageRelation();
    },

    // 适用于Task，当上面的item更新后同步更新MessageRelation里Group里修改的item
    synchronous_update_mrfield_item(Key, newValue) {
      const businessObject = this.element.businessObject;
      if (!businessObject.mrfield_list) {
        return;
      }

      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        let mrfield_Keyname = i.split("_")[0];
        // console.log("当前的mrfield_Keyname是:", mrfield_Keyname);

        for (let j in mrfield_list_item[mrfield_Keyname].$attrs) {
          if (j === Key) {
            mrfield_list_item[mrfield_Keyname].$attrs[j] = newValue;
          }
        }
      }
    },

    // 适用于Task，当上面的item的Key更新后同步更新MessageRelation里Group里修改的item
    synchronous_updateKey_mrfield_item(oldKey, newKey, Value) {
      const businessObject = this.element.businessObject;
      if (!businessObject.mrfield_list) {
        return;
      }

      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        let mrfield_Keyname = i.split("_")[0];
        // console.log("当前的mrfield_Keyname是:", mrfield_Keyname);

        for (let j in mrfield_list_item[mrfield_Keyname].$attrs) {
          if (j === oldKey) {
            delete mrfield_list_item[mrfield_Keyname].$attrs[j];
            mrfield_list_item[mrfield_Keyname].$attrs[newKey] = Value;
          }
        }
      }
    },

    // 适用于Task，当上面的item删除后同步删除MessageRelation里Group里修改的item
    synchronous_delete_mrfield_item(Key) {
      const businessObject = this.element.businessObject;
      if (!businessObject.mrfield_list) {
        return;
      }

      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        let mrfield_Keyname = i.split("_")[0];
        // console.log("当前的mrfield_Keyname是:", mrfield_Keyname);

        for (let j in mrfield_list_item[mrfield_Keyname].$attrs) {
          if (j === Key) {
            delete mrfield_list_item[mrfield_Keyname].$attrs[j];
          }
        }
      }
    },

    // 修改MessageRelation里的组名
    update_MRField_GroupName(event, key) {
      // console.log("原组名", key);
      // console.log("新组名:", event.target.value);

      let newName = event.target.value;
      const businessObject = this.element.businessObject;
      const mrfield_list = businessObject.mrfield_list.$attrs;

      for (let i in mrfield_list) {
        if (mrfield_list[i] === key) {
          mrfield_list[i] = newName;
          // console.log("当前的mrfield_Keyname是:", i);
        }
      }
      this.read_MessageRelation();  // 更新MessageRelation
    },

    // 判断当前点击的元素有没有带有多实例标志
    verifyIsMultiInstance(element) {
      // 获取多实例特性
      const loopCharacteristics = element.businessObject.loopCharacteristics;

      // 先删除可能存在的 label 元素 和 EndCondition图标
      this.delete_InstanceNumber_label();
      // this.delete_EndConditionIcon();

      // 检查多实例特性是否存在、检查多实例特性的类型是否为 bpmn:MultiInstanceLoopCharacteristics
      if (!loopCharacteristics || loopCharacteristics.$type !== 'bpmn:MultiInstanceLoopCharacteristics') {
        // console.log('该元素没有多实例特性 || 该元素的多实例特性类型不正确');
        delete element.businessObject.InstanceNumber;
        // delete element.businessObject.EndCondition;
        return false;
      }

      this.paint_InstanceNumber();
      // this.paint_EndConditionIcon();
      return true;
    },

    verifyIsMultiReceiveTask(element) {
      const type = element.type;
      // 获取多实例特性
      const loopCharacteristics = element.businessObject.loopCharacteristics;

      // 先删除可能存在的 EndCondition图标
      this.delete_EndConditionIcon();

      // 检查多实例特性是否存在、检查多实例特性的类型是否为 bpmn:MultiInstanceLoopCharacteristics
      // 检查元素是否是bpmn:ReceiveTask
      if (!loopCharacteristics || loopCharacteristics.$type !== 'bpmn:MultiInstanceLoopCharacteristics' || type !== 'bpmn:ReceiveTask') {
        // console.log('该元素没有多实例特性 || 该元素的多实例特性类型不正确');
        delete element.businessObject.EndCondition;
        return false;
      }

      this.paint_EndConditionIcon();
      return true;
    },

    // 更新InstanceNuber
    update_InstanceNuber(event, InstanceNumber) {
      const InstanceNumber_value = event.target.value;
      this.element.businessObject[InstanceNumber] = InstanceNumber_value;
      this.delete_InstanceNumber_label();
      this.paint_InstanceNumber();  // 将InstanceNumber画出来
    },

    // 删除InstanceNumber_label
    delete_InstanceNumber_label() {
      if (!this.element.InstanceNumber_label) {
        return
      }
      const { modeler, element } = this;
      const elementRegistry = modeler.get('elementRegistry');
      const gfx = elementRegistry.getGraphics(element); // 获取元素图形表示

      // 先删除可能存在的 label 元素

      gfx.removeChild(element.InstanceNumber_label);  // 将画布上先前显示的数字删去
      delete element.InstanceNumber_label;  // 删掉这个标签
    },

    // 将InstanceNumber画出来
    paint_InstanceNumber() {
      const InstanceNumber = this.element.businessObject.InstanceNumber;  // 获取要显示的文本
      this.InstanceNumber = InstanceNumber;
      if (!InstanceNumber) {  // 如果element.businessObject.InstanceNumber为空就直接返回
        return;
      }

      const { modeler, element } = this;
      const elementRegistry = modeler.get('elementRegistry');
      const gfx = elementRegistry.getGraphics(element); // 获取元素图形表示

      // 创建并设置label元素
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('class', 'djs-label');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '18px');

      // 设置label的位置
      const bbox = gfx.getBBox();
      const x = bbox.x + bbox.width / 2;
      const y = bbox.y + bbox.height + 13;
      label.setAttribute('x', x);
      label.setAttribute('y', y);
      label.textContent = `[ ${InstanceNumber} ]`;

      gfx.appendChild(label);  // 添加label元素到元素图形中
      element.InstanceNumber_label = label;   // 保存 label 元素
    },

    // 修改下拉框EndCondition后的动作
    changeEndConditionType(event) {
      const { modeler, element } = this
      const value = event.target.value;  // 当前下拉框选择的值
      element.businessObject.EndCondition = value;
      this.EndConditionType = value;

      // 先删除图片，再加新的图片
      this.delete_EndConditionIcon();
      this.paint_EndConditionIcon();
    },

    // 将EndConditionIcon画在图形上
    paint_EndConditionIcon() {
      let EndCondition = this.element.businessObject.EndCondition;
      this.EndConditionType = EndCondition ? EndCondition : null;
      if (!EndCondition) {  // 如果element.businessObject.EndCondition为空就直接返回
        return;
      }

      const { modeler, element } = this;
      const elementRegistry = modeler.get('elementRegistry');
      const gfx = elementRegistry.getGraphics(element);  // 获取任务元素的图形
      const bounds = gfx.getBBox();  // 获取图形的边界框

      let img = null;   // 要绘制的图像
      if (EndCondition === "Number") {
        img = require('@/assets/Number.png');
      } else if (EndCondition === "Time") {
        img = require('@/assets/Time.png');
      } else if (EndCondition === "Race") {
        img = require('@/assets/Race.png');
      }

      // 创建图像元素
      const EndConditionIcon = svgCreate('image', {
        x: bounds.x + bounds.width - 36,
        y: bounds.y + 6,
        width: 28,
        height: 28,
        href: img
      })
      svgAppend(gfx, EndConditionIcon);   // 在任务元素的图形上绘制图标
      element.EndConditionIcon = EndConditionIcon;  // 将EndConditionIcon保存在shape里面，方便日后删除
    },

    // EndConditionIcon从图形上删除
    delete_EndConditionIcon() {
      // 如果element.EndConditionIcon为空表面图片不存在，直接返回
      if (!this.element.EndConditionIcon) {
        return;
      }

      const { modeler, element } = this;
      const elementRegistry = modeler.get('elementRegistry');
      const gfx = elementRegistry.getGraphics(element);  // 获取任务元素的图形

      gfx.removeChild(element.EndConditionIcon);  // 将画布上先前显示的图片删去
      delete this.element.EndConditionIcon;
    },

    update_ConditionNum(event, ConditionNum) {
      const ConditionNum_value = event.target.value;
      this.element.businessObject[ConditionNum] = ConditionNum_value;
      this.ConditionNum = ConditionNum_value;
    },

    update_ConditionTime(event, ConditionTime) {
      const ConditionTime_value = event.target.value;
      this.element.businessObject[ConditionTime] = ConditionTime_value;
      this.ConditionTime = ConditionTime_value;
    },

    /**
     * 改变结点颜色
     * @param { Object } event: 事件的类型
     * @param { String } type: fill:节点的填充色， stroke: 节点边框的颜色和节点label的颜色
     */
    SetColor(event, type) {  // 改变节点颜色
      const color = event.target.value;
      const { modeler, element } = this;
      const modeling = modeler.get('modeling');
      modeling.setColor(element, {
        [type]: color
      })
    },

    /**
     * 改变控件触发的事件
     * @param { Object } input的Event
     * @param { String } 要修改的属性的名称
     */
    changeField(event, type) {
      const value = event.target.value;
      this.element[type] = value
      let properties = {}
      properties[type] = value

      this.updateProperties(properties);  // 调用属性更新方法
    },

    /**
     * 更新元素属性
     * @param { Object } 要更新的属性, 例如 { name: '' }
     */
    updateProperties(properties) {  // 公用的属性更新方法
      const { modeler, element } = this;
      const modeling = modeler.get('modeling');  // modeling.updateProperties()用来修改e.element的内容
      modeling.updateProperties(element, properties)
    }
  },

  computed: {
    isEvent() {  // 判断当前点击的element是不是event
      const { element } = this;
      return this.verifyIsEvent(element.type)
    },
    isTask() {  // 判断当前点击的element是不是Task
      const { element } = this;
      return this.verifyIsTask(element.type)
    },
    isDataReference() {  // 判断当前点击的element是不是DataObjectReference
      const { element } = this;
      return this.verifyIsDataReference(element.type)
    },
    isSendOrReceiveTask() {  // 判断当前点击的element是不是"bpmn:SendTask"、"bpmn:ReceiveTask"
      const { element } = this;
      return this.verifyIsSendOrReceiveTask(element.type)
    },

    isMultiInstance() {  // 判断当前点击的元素有没有带有多实例标志
      const { element } = this;
      return this.verifyIsMultiInstance(element)
    },
    isMultiReceiveTask() {
      const { element } = this;
      return this.verifyIsMultiReceiveTask(element)
    }
  }
}
</script>

<style scoped>
.custom-properties-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
  background-color: #F8F8F8;
  border-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
}


.element-item {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid;
  border-color: #CECFD1;
  border-radius: 8px;
}

.element-item:first-child {
  margin-top: 0;
}


.custom-properties-panel label {
  font-weight: bold;
}

.custom-properties-panel label:after {
  content: '：';
}
</style>
