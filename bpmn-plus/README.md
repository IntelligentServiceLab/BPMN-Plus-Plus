

<h1 align="center">bpmn-plus</h1>



<p align="center">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/SongChaotian/bpmn-plus?style=flat&logo=github" />
<img alt="GitHub stars" src="https://img.shields.io/github/forks/SongChaotian/bpmn-plus?style=flat&logo=github" />
</p>
<p align="center">
<img src="https://img.shields.io/badge/Bootstrap-5.2.3-brightgreen" alt="" />
<img src="https://img.shields.io/badge/Bpmn.js-11.5.0-important" alt="" />
<img src="https://img.shields.io/badge/Vue-2.7.14-critical" alt="" />
</p>




This project is abut BPMN properties extension , and based on BPMN.js and Vue implementation. The project has been deployed on a cloud server. [Click here to access it.](http://124.71.159.213:10086/bpmn-plus)Specific initialization is shown as follow:

![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/001.png)

## Extension description: 

- The following extensions are based on [bpmn.io](https://bpmn.io/). 
- The content of the extension is saved in the model file with XML format.



## Extension requirements :

1. An element property panel is provided to support the following extension functionalities. Clicking an element displays its corresponding properties.

   

2. For `DataObjectReference` and `DataStoreReference`, a feature is provided to define multiple data items (with unlimited quantity), as shown in the right figure. Clicking on the "+" button creates a new data item, which is defined by the user (`e.g.`, Team1: Warriors, Team2: Lakers, Team3: Clippers). When the model is saved, the created data items will be associated with the corresponding elements and saved synchronously.

   ![需求2](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/002.png)

   ![需求2](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/003.png)

   

3. For message send/receive tasks, a functionality similar to requirement 2 has been implemented, which can be referred to in the following figure. Clicking the "+" sign creates a new message field, which is user-defined (such as Team1: Argentina, Team2: France, Team3: Croatia, Team4: Morocco). When the model is saved, the created message fields are associated with the corresponding tasks and saved synchronously.

4. For message send/receive tasks, an additional feature has been implemented on the basis of requirement 3, similar to extension 2. It is temporarily referred to as "`Add MessageRelation Field`". Clicking on the "+" sign allows users to add new data fields (whose names are customizable, such as group1, group2,...). The content of each group can be selected from among several of the Team1, Team2,... data items already created in extension 2 (with no limit on the number of items that can be included in each group), or they can be manually inputted. The same saving requirements as mentioned above apply.

   ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/004.png)

5. For the elements with multiple instance markers (three horizontal or vertical bars), such as multiple instance pools, multiple instance activities, and multiple instance sub-processes, an attribute called "`InstanceNumber`" has been added to indicate the number of instances of the element. The user can fill in the value of this attribute, and a default value (such as "None") is provided to indicate that the number of instances cannot be determined. This extension displays the value of this attribute on the graphical representation of the element, and it is required to be saved in the same way as mentioned above.

   ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/005.png)

   

6. For the parallel and sequential multiple instance `ReceiveTask`, an attribute named "`EndCondition`" has been added to indicate the condition for the task to end. This attribute provides three options: `MessageNum` (quantity), Time, and Race:

   ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/006.png)

   -  When the user chooses `MessageNum`, a field is provided (such as `ConditionNum`, indicating the number of messages received to end the task). The default value of this field is the same as the `InstanceNumber` of the receive task and can also be manually entered by the user.

     ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/007.png)

   - When the user chooses Time, a new attribute is provided (such as `ConditionTime`, indicating the time to end the task after a specified time period). The user sets the value of this attribute. When the user chooses this option, a timer icon can be displayed on the corresponding element image.

     ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/008.png)

   - When the user chooses Race, the user is allowed to set both `ConditionTime` and `ConditionNum` at the same time. There is certain information display on the graphic to distinguish it from options [1] and [2].

     ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/009.png)

   When the model is saved, the user's selection for `EndCondition` is explicitly recorded, as well as the specific ending conditions (`ConditionNum` and `ConditionTime`) corresponding to it.



## Installing dependencies

```shell
npm install
```



## Launch Project

```shell
npm run serve
```



## Update Notes

> The latest update for bpmn-vue-sct

### Update Notes (Mar 29)

1. The introduction of a new feature allowing users to directly open local BPMN files via a simple drag-and-drop operation has not only provided a more convenient and efficient way of operation but also enhanced the overall user experience.
2. Additionally, ten new custom elements, namely `ImageTask`, `IndustrialRobotsTask`, `SensorTask`, `AudioTask`, `CollectTask`, `PrivacyTask`, `IntelligentTask`, `TransportTask`, `DeliveryTask`, and `DataGateway`, have been added to the left toolbar. These custom elements have been meticulously designed to meet various modeling needs in the industrial internet, as indicated by the red boxes in the figure below. Their inclusion has enriched the system's library of elements and further expanded the possibilities of modeling.

![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/Mar29_01.png)

### Update Notes (Mar 24)

1. The system has added a new feature to create a new canvas. Users can operate by following the steps shown in the figure below and click the button to create a new canvas.

   ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/Mar24_01.png)

   The new canvas looks as shown in the following figure:

   ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/Mar24_02.png)

2. The system has added keyboard shortcuts for copying and pasting.

   ①`Ctrl+c`: Selecting an element and pressing this shortcut will copy the element, including its `type` and attributes stored in the element.

   ②`Ctrl+v`: Paste the copied element. The pasting location is determined by the user's mouse click in the canvas.

3. The system has fixed the issue of incomplete element deletion when using the `delete` shortcut to delete multiple selected elements.

4. The system has fixed the issue of being unable to download BPMN files from the initial interface.

5. The system has fixed the issue of being unresponsive when uploading a BPMN file with the same file name.

6. The system has added a rule: after creating a new canvas or importing a new BPMN file from the local device, using `ctrl+z` to undo the previous operation is not allowed to return to the previous canvas interface. In other words, the undo operation can only undo to the state after the new canvas is created.



### Update Notes (Mar 15)

1. Add the function to import local BPMN files.

   Importing local BPMN files is very simple and can be done in 2 steps:

   Step1：Click on the icon in the bottom left corner that looks like a folder.

   ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/Mar15_01.png)

   Step2：Upload the local BPMN file and it will be successfully imported.

   ![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/Mar15_02.png)

2. Add three keyboard shortcuts:

   ①`Delete`：Delete the selected element.

   ②`Ctrl+z`：Undo the last operation.

   ③`Ctrl+Shift+z`：Redo the last operation that was undone.

   

### Update Notes (Mar 12)

1. I upgraded the bpmn-js version of the project from 6.5.1 to the latest version 11.5.0 and fixed the incompatibility issues between the new and old versions: rewrote some Callbacks functions in bpmn-js to Promises form, referring to the link: [Moving from Callbacks to Promises](https://github.com/bpmn-io/bpmn-io-callbacks-to-promises). The functions that need to be modified in the project are: importXML, saveXML, saveSVG.
2. Add some initial element examples when initializing the project to give users a preliminary understanding of how to use it
3. Change the two buttons saveXML and saveSVG added on Feb 23 to icon form
4. In the function of setting colors for BPMN elements, it has been improved from only being able to set the border color to being able to set both the border color and the fill color



### Update Notes (Feb 23)

I have added two buttons to export modeling elements into BPMN and SVG formats, respectively.



### Update Notes (Feb 22)

I have implemented Requirement 6 and fixed a bug that occurred when modifying or deleting datafields. The bug was caused by accessing the `mrfield_list` during synchronous update and deletion operations, which led to errors when `mrfield_list` did not exist. The fix was to check for the existence of `mrfield_list` before performing synchronous update or deletion.



### Update Notes (Feb 16)

I have completed Requirement 5 and modified the original code for setting colors by adding a functionality to pre-fetch colors in the right-hand property bar.

![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/012.png)



### Update Notes (Feb 10)

In order to implement Requirement 4, my initial idea was to construct an object and then store objects inside the object. This approach seemed correct, but I encountered many difficulties during the implementation process. Initially, I tried to directly store objects inside the object in JavaScript, and then called the attribute update method. However, the result obtained was obviously incorrect, because "objects cannot be stored directly" in XML. Then, I changed my approach and created a child node to store the data, and then stored the child node in the node. In this way, I was able to achieve the goal of storing objects inside the object from a different perspective.

![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/011.png)





### Update Notes (Feb 4)

Requirement 2 and Requirement 3 have similar characteristics, therefore, I stored the extended data under businessObject.$attrs to reduce code redundancy and other potential issues.

![](https://raw.githubusercontent.com/SongChaotian/bpmn-plus/main/screenshoot/010.png)



