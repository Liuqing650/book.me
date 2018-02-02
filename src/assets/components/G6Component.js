import React from 'react';
import { Tag,Radio,message,Button, Icon,Row,Popover, Col } from 'antd';
import EditModal from './EditModal';
import AddModal from './AddModal';
const RadioGroup = Radio.Group;
// import G6 from 'g6js';

var Global = G6.Global;
var Util = G6.Util;
Global.nodeControlPointStyle = null;
Global.nodeAcitveBoxStyle = {
	stroke: '#108EE9',
	fill: '#00B5F4',
	fillOpacity: 0.2,
	lineWidth: 2,
	radius: 4
};


let uniqueId = 0;
function generateUniqueId() {
  return `rc-g6-0`;
}

/*
    修改方向：
    1.接通后台数据，
    2.点击添加节点开始插入语句，这里需要判断是否是首个节点，为首个节点的时候，那么将创建根节点
    3.根节点产生时需要向后台请求数据
    4.子节点每添加一个回车完成以后，即向后台传递新增接口参数
    5.删除子节点的时候需要判断后面是否还有子节点，有则无法删除

*/


class G6Component extends React.Component {

    constructor(props, context) {
        // console.log('props--------->',props);
		super(props, context);
        this.state = {
            // 查询数据配置
            isFind : false, //初始化搜索的值
            findIndex: 0,
            // 编辑模态框配置
            editVisible: false,
            modelData: {},
            node: {},
            // 新增模态框配置
            addVisible: false,
            // 存储状态
            isSave: false,
            // 阅读模式
            isRead: false,
        }
        this.state = {...this.props};

        /* 内部配置 */

        // id生成函数
        this.graphId = generateUniqueId();
        this.toolArr = [
            {label:'添加模式',value:'add',icon:'plus',isUse:true},
            {label:'编辑详情',value:'edit',icon:'edit',isUse:true},
            {label:'修改模式',value:'update',icon:'hourglass',isUse:true},
            {label:'删除模式',value:'delete',icon:'delete',isUse:true},
            // {label:'保存数据',value:'save',icon:'save',isUse:true},
        ];

        // 运行状态 [默认状态为编辑状态]
        this.operationState = {isEdit:true,isAdd:false,isUpdate:false,isDelete:false,isInput:false,isSave:false,isShowInput:false};

		this.graph = null;
		this.input = {};
        this.searchedArray=[]; // 检索的所有记录
        this.find = null; //当前显示的检索数据

		this.inputHide = this.inputHide.bind(this);
		this.inputShow = this.inputShow.bind(this);

		this.mouseEnterNodeStyle = {
			lineWidth: 2,
            stroke: '#108ee9',
		};

		this.nodeStyle = {
		    lineWidth: 1,
		};

        this.findAllStyle = {
            lineWidth: 1,
            stroke: '#ffbf00',
        }

        this.findThisStyle = {
            lineWidth: 2,
            stroke: '#f50',
        }

        // G6图形生成函数
		this.hasClass = this.hasClass.bind(this);
		this.findByClass = this.findByClass.bind(this);
		this.showInputLabel = this.showInputLabel.bind(this);
		this.updateLabel = this.updateLabel.bind(this);
        this.clearAllActived = this.clearAllActived.bind(this);
		this.setyieldData = this.setyieldData.bind(this);

        // 光标移动事件
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLever = this.onMouseLever.bind(this);

        // G6结构图编辑事件（单击、双击、按键、删除、失去焦点）
      	this.onDbClick = this.onDbClick.bind(this);
      	this.onEditTitle = this.onEditTitle.bind(this);
		this.onAddTree = this.onAddTree.bind(this);
		this.onKeyDownInput = this.onKeyDownInput.bind(this);
        this.onMoveNode = this.onMoveNode.bind(this);
        this.onHideInput = this.onHideInput.bind(this);
		this.onBlurG6 = this.onBlurG6.bind(this);

        // 工具按钮
        this.configTool = this.configTool.bind(this);
        this.onToolClick = this.onToolClick.bind(this);
        this.G6ModelChange = this.G6ModelChange.bind(this);

        // 数据存储
        this.handleSaveData = this.handleSaveData.bind(this);
        this.createTreeData = this.createTreeData.bind(this);

        // 其他触发事件
        this.onChangeSeacrhG6 = this.onChangeSeacrhG6.bind(this);
        this.onFindData = this.onFindData.bind(this);
        this.findTreeData = this.findTreeData.bind(this);
        this.onNextNode = this.onNextNode.bind(this);
        this.findCanvasNote = this.findCanvasNote.bind(this);
        this.updateStyle = this.updateStyle.bind(this);
        this.onCloseFind = this.onCloseFind.bind(this); //关闭查找事件

        this.isStartKeyListener = this.isStartKeyListener.bind(this) // 启动键盘监听事件
        this.toolChangeByKey = this.toolChangeByKey.bind(this) //table改变工具栏状态
        this.isChangeModel = this.isChangeModel.bind(this); // 判断是否可以改变模式
        this.changeNowOperationState = this.changeNowOperationState.bind(this); //记录当前操作状态
        // 中心化
        this.centerPoint = this.centerPoint.bind(this);
        // 模态框
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onOpenAddModal = this.onOpenAddModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);

        // 提前执行内部配置函数
        this.configTool(this.props.configTool);

    }

    componentDidMount() {
        this.isStartKeyListener(true);
        // this.initGraph(this.props);
    }

    componentWillReceiveProps(newProps) {
      const { width: newWidth, height: newHeight, search, data: newData, kbid: newKbid,isEditKnowledge: newEditKnowledge, isRead } = newProps;
      const { width: oldWidth, height: oldHeight,data: oldData, kbid: oldKbid, isEditKnowledge: oldEditKnowledge } = this.props;
        if (newWidth !== oldWidth || newHeight !== oldHeight) {
            this.graph.changeSize(newWidth, newHeight);
        }
        if(newData !== oldData) {
            if(this.graph) {
               this.graph.destroy();  
            }
             this.initGraph(newProps);
        }
        if(newKbid != oldKbid) {
             this.setState({
                kbid: newKbid,
            })
        }
        this.setState({
            toolSelected: newProps.toolSelected,
            loading: newProps.loading,
            isShowToolHealp: newProps.isShowToolHealp,
            isRead: isRead,
        })
        if(search&&search.isSearch) {
             this.setState({
                search: search,
            })
            this.onFindData(search);
        }

        if(newEditKnowledge !== oldEditKnowledge) {
            if(newEditKnowledge&&newEditKnowledge==2) {
                this.onCloseModal({isEdit:true})
            }
        }
    }

    shouldComponentUpdate() {
      return true;
    }

    componentWillUnmount() {
		this.graph.destroy();
		this.graph = null;
		this.graphId = null;
    	this.setState({
            isSave: false,
        })
    }

    // 初始化G6
        /*
         * 初始化G6
         * @param props
         * return null
         */
        initGraph(props) {
            const graph = new G6.Tree({
                id: this.graphId,
                fitView: 'cc',
                ...props
            });
            // __operation(graph);
            graph.source(props.data);
            this.graph = graph;
            this.graph.tooltip(true);
            this.graphContainer = this.graph.get('graphContainer');
            this.input = Util.createDOM('<input class="g6-label-input" />', {
                position: 'absolute',
                zIndex: 10,
                display: 'none'
            });
            this.graphContainer.appendChild(this.input);
            this.graph.addBehaviour('default', ['clickActive']);
            this.graph.addBehaviour('default', ['clickBlankClearActive']);
            this.graph.node().label('name').style(this.nodeStyle);
            this.graph.edge().shape('smooth');
            this.graph.node().tooltip(function(obj){
                return [
                  ['简要信息', obj.name]
                ]
            });
            this.graph.render();
            this.graph.on('itemmouseenter', this.onMouseEnter);
            this.graph.on('itemmouseleave', this.onMouseLever);

            this.graph.on('dblclick', this.onDbClick);
            this.input.on('keydown', this.onKeyDownInput);
            this.graph.on('dragmove', this.onHideInput);
            this.graph.on('blur', this.onBlurG6);
            if(this.state.toolSelected&&this.state.toolSelected.value) {
                this.G6ModelChange(this.state.toolSelected);
            }
        }

    // G6初始化方法模块
        /*
         * 插入异步数据
         */
        setyieldData(data) {
            this.graph.source(data);
            this.graph.refresh();
        }

        /*
         * 判断是否获取到类名
         */
        hasClass(shape, className) {
    		if (shape) {
    		  	var clasees = shape.get('class');
    			if (clasees && clasees.indexOf(className) !== -1) {
    				return true;
    			}
    		}
    		return false;
    	}

        /*
         * 查找类名
         */

        findByClass(child) {
            let result;
            if(this.hasClass(child, 'label')){
                result = true;
            } else {
              result = false;
            }
            return result;
        }

        /*
         * 空方法块
         */
        nullFn() {}

    // 输入框模块
        /*
         * 显示输入框
         */
    	showInputLabel(node) {
            if(!node){
              return;
            }

            var group = node.get('group');
            var label = group.findBy(this.findByClass);
            var rootGroup = this.graph.get('rootGroup');
            var bbox = Util.getBBox(label, rootGroup);
            var borderWidth = 1;
            var text = label.attr('text');
            this.clearAllActived();
            this.input.value = text;
            this.inputShow();
            this.input.css({
    			top: bbox.minY - borderWidth + 'px',
    			left: bbox.minX - borderWidth + 'px',
    			width: bbox.width + 'px',
    			height: bbox.height + 'px',
    			padding: '0px',
    			margin: '0px',
    			border: borderWidth + 'px solid #999'
            });
            this.input.focus();
            this.input.node = node;
        }

        // 隐藏输入框
        /*
         * 这里updateLabel();方法用于处理当用户处于编辑状态的时候拖动画布，将关闭输入框，这时容易造成当前数据丢失，所以移动的时候输入框没有关闭则会直接保存后再关闭输入框
         */
        onHideInput() {
            if(this.operationState.isInput?true:false) {
                if(this.operationState.isShowInput?true:false) {
                    this.updateLabel();
                } else {
                    this.inputHide();
                }
            }
        }

        /*
         * 更新模块信息输入框
         */
        updateLabel() {
            if(this.input.visibility){
              	var node = this.input.node;
        		let model = node.get("model");
        		let parent = model.parent;
        		// console.log("model----------->",model);
        		let obj={};
        		let sendData = {};
        		let payload = {};
        		let toolSelected = this.state.toolSelected;
        		// {"dialog_info":[{"kb_id":"d1590358acc54325bae99f52a5c4c76b","dia_pid":"0","dia_title":"第一个节点"}  ]}
        		obj["dia_id"] = model.id;
        		obj["dia_title"] = this.input.value?this.input.value:model.name;
        		payload["isAdd"] = false;
        		if(toolSelected.value=="add") {
        			obj["kb_id"] = this.state.kbid;
        			obj["dia_pid"] = parent.id;
        			payload["isAdd"] = true;	// 是否是新增
        		}
        		sendData["dialog_info"] = [obj];
        		payload["data"] = sendData;
        		this.props.onEditNode(payload);
              	this.clearAllActived();
              	if(this.input.value !== node.get('model').name){
    	            if(this.input.value){
    	              	this.graph.update(node, {
    	                	label: this.input.value
    	              	});
    	            }
              	}
              	this.inputHide();
            }
        }
        /*
         * 清除激活状态
         */
        clearAllActived(){
            this.graph.clearAllActived();
            this.graph.refresh(false);
        }

        /*
         * 输入框显示/消失
         */
        inputShow() {
            this.changeNowOperationState("isShowInput",true); // 开启输入框
            this.changeNowOperationState("input",true); // 开启输入框状态
            this.isStartKeyListener(false); // 关闭键盘操作工具栏事件
            this.input.css({
                display: 'block'
            });
            this.input.visibility = true;
        }
        inputHide() {
            this.changeNowOperationState("isShowInput",false); // 关闭输入框
            this.changeNowOperationState("input",false); // 关闭输入框状态
            this.isStartKeyListener(true); // 开启键盘操作工具栏事件
            this.input.css({
                display: 'none'
            });
            this.input.visibility = false;
        }

    // 事件处理区(光标移入、光标移出、编辑树形图title、双击打开模态框)
        // 光标移入
        onMouseEnter(ev) {
        	if(ev.itemType !== 'node'){
              return;
            }
            var keyShape = ev.item.getKeyShape();
            keyShape.attr(this.mouseEnterNodeStyle);
            this.graph.refresh();
        }

        // 光标移出
        onMouseLever(ev) {
        	if(ev.itemType !== 'node'){
              return;
            }
            this.graph.reRender();
            var keyShape = ev.item.getKeyShape();
            this.graph.refresh();
        }

        // 编辑树形图title
        onEditTitle(ev) {
        	var item = ev.item;
            var shape = ev.shape;
            if ( this.hasClass(shape, 'label') && item && item.get('type') === 'node') {
              this.showInputLabel(item);
            }
        }

        // 双击事件
        onDbClick(ev) {
        	var item = ev.item;
            var shape = ev.shape;
            this.onOpenModal(item);
        }

        
        onAddTree(ev) {
        	var active = this.graph.getActived();
            let newNode;
            var id;
            // let model = active.get("model");
            // if(model.root) {
            //     let parent = model.dia_id;
            // }
            if(active && active.get('type') === 'node'){
              	id = active.get('id');
              	if(!active){
                	return;
              	}
              	newNode = this.graph.add(id, {
              		id: G6.Util.guid(),
                	name: '单击模块可新增新模块'
              	});
                window.setTimeout(this.showInputLabel(newNode), 1000);
            }
        }


        // 删除事件 {"kb_id":"","dia_id":""}
        onMoveNode(ev) {
            var active = this.graph.getActived();
            let model = active.get("model");
            var id;

            if(model.children&&model.children.length>0) {
                message.info('此节点还有子节点,请先删除子节点！');
            } else {
                if(active && active.get('type') === 'node'){
                    id = active.get('id');
                    if(!active){
                        return;
                    }
                    let obj = {};
                    obj["kb_id"] = this.state.kbid;
                    obj["dia_id"] = id;
                    this.props.onDelKbDialog(obj);
                    this.graph.remove(id);
                } 
            }
        }

        // 失去焦点
        onBlurG6() {
        	this.updateLabel();
        }

    // 搜索功能区
        // 改变搜索状态
        onChangeSeacrhG6(isSearch) {
            const obj = {};
            obj.isSearch = isSearch;
            this.props.onSeacrhG6(obj);
        }

        // 搜索数据
        onFindData(searchData) {
            let data = [this.graph.save().source];
            let text = searchData.search;
            let handleData = this.findTreeData(data,text);
            if(handleData&&handleData.length>0) {
                this.searchedArray = handleData;
                message.success('检索成功，检索到【 '+handleData.length+' 】条数据');
                let arr = this.searchedArray;
                if(arr&&arr.length>0) {
                    arr.map((item,index)=>{
                        this.findCanvasNote(item,this.findAllStyle);
                    })
                }
                this.find = this.searchedArray[0];
                this.setState({
                    isFind: true,
                    findIndex: 1,
                })
                this.findCanvasNote(this.find,this.findThisStyle);
                this.props.onSeacrhG6({isSearch:false})
            } else {
                this.onCloseFind();
                message.warning('没有检索到任何数据');
                this.props.onSeacrhG6({isSearch:false})
            }
            
        }
        // 判断上一条或者下一条数据
        onNextNode(obj) {
            let arr = this.searchedArray;
            let left = 0;
            let right = arr&&arr.length>0?arr.length-1:0;
            let isLeft = false;
            let isRight = false;
            this.find = this.find==null?arr[0]:this.find;
            this.graph.reRender();
            if(arr&&arr.length>0) {
                arr.map((item,index)=>{
                    this.findCanvasNote(item,this.findAllStyle);
                    if(item==this.find) {
                        isLeft = index>0 ? false : true;
                        isRight = index<arr.length-1 ? false : true;
                        left = index>0 ? index-1 : 0;
                        right = index<arr.length-1 ? index+1: arr.length-1;
                    }
                })
            }
            if(obj.findState=='left') {
                if(isLeft) {
                    message.warning('已经到第一条了！');
                }
                this.find = arr[left];
                this.setState({
                    findIndex: left+1,
                })
                this.findCanvasNote(this.find,this.findThisStyle);
            } else {
                if(isRight) {
                    message.warning('已经到最后一条了！');
                }
                this.find = arr[right];
                this.setState({
                    findIndex: right+1,
                })
                this.findCanvasNote(this.find,this.findThisStyle);
            }
            
        }

        // 查找Canvas中所在的数据
        findCanvasNote(findId,style) {
            if(findId) {
                const keyNode = this.graph.find(findId)
                // console.log("keyNode--------->",keyNode);
                // let boxStash = keyNode._attrs.boxStash;
                this.updateStyle(keyNode,style);
                this.graph.refresh();  
            }
        }

        // 修改固定样式
        updateStyle(node,style) {
            var keyShape = node.getKeyShape();
            keyShape.attr(style);
            // this.graph.focusPoint(node);
            this.graph.refresh();
        }

        // 关闭查找事件
        onCloseFind() {
            this.searchedArray=[];
            this.setState({
                isFind: false
            })
        }

    // 按钮功能区 ( 按钮编辑模式, 工具点击事件, 工具切换快捷键)
        // 按钮编辑模式
        configTool(tools) {
            let result = this.toolArr;
            if(tools&&tools.length>0) {
                tools.map((item)=>{
                    this.toolArr.map((temp,index)=>{
                        if(temp.value==item.value) {
                            result[index].isUse = item.isUse;
                        }
                    })
                })
            }
            this.toolArr = result;
        }
        // 工具点击事件
        onToolClick(item) { //this.operationState = {isEdit:true,isAdd:false,isUpdate:false,isDelete:false,isInput:false,isSave:false};
            let isChange = this.isChangeModel();
            if(isChange) {
                return;
            }
            this.changeNowOperationState(item.value,true);
            if(item.value=="add") {
                if(this.graph==null) {
                    this.initGraph(this.props);
                } else {
                    const data = this.graph.save();
                    if(data.source&&!data.source.id) {
                        // 如果没有根节点，那么将弹窗需要录入根节点信息
                        this.onOpenAddModal();
                    } 
                }
            }
            if(item.value=="save") {
            	this.setState({
    	            isSave: true,
    	        })
            } else {
            	this.setState({
    	            isSave: false,
    	        })
            }
            this.props.onModelChange(item);
        }

        // 工具切换快捷键
        toolChangeByKey(ev) {
            if(ev.keyCode === 9){
                ev.preventDefault();             
                ev.stopPropagation();

                let toolSelected = this.state.toolSelected;
                let toolArr = this.toolArr;
                let toolDefault = this.state.toolDefault;
                let count = 0;
                let nextSelect = {};
                if(!toolSelected.value) {
                    toolArr.map((item,index)=>{
                        if(item.value==toolDefault.value) {
                            toolSelected = item;
                        }
                    })
                }
                toolArr.map((item,index)=>{
                    if(item.value==toolSelected.value) {
                        if(index>=0&&index<toolArr.length-1) {
                            count = index+1;
                        }
                        if(index>=toolArr.length) {
                            count = 0;
                        }
                        nextSelect = toolArr[count];
                    }
                })
                this.onToolClick(nextSelect)
            }
        }

    // 模式切换判断（改变当前操作状态，判断是否可继续改变其他模式，模式切换[**在此进行操作功能重组]）
        /* 改变当前操作状态
         * @param 当前操作模式，可以动态改变当前模式的当前真实状态，input模式是可存在于任何模式下的状态，属于最高状态。
         * @param add|edit|update|delete|save|input|isShowInput ,   true|false 
         * return null
         */
        changeNowOperationState(model,isUse) {
            for(let key in this.operationState) {
                if(model=="add") {
                    this.operationState.isAdd = isUse;
                } else if(model=="edit") {
                    this.operationState.isEdit = isUse;
                } else if(model=="update") {
                    this.operationState.isUpdate = isUse;
                } else if(model=="delete") {
                    this.operationState.isDelete = isUse;
                } else if(model=="save") {
                    this.operationState.isSave = isUse;
                } else if(model=="input") {
                    this.operationState.isInput = isUse;
                } else if(model=="isShowInput") {
                    this.operationState.isShowInput = isUse;
                } else {
                    this.operationState[key] = false;
                }
            }
        }

        /* 判断是否可继续改变其他模式
         * @param null
         * return false | true
         */
        isChangeModel() {
            let result = false;
            if(this.operationState&&this.operationState.isInput?true:false) {
                message.warning("请确认正在编辑的模块是否完成，回车键 提交",1);
                result = true;
            }
            return result;
        }

        // 模式切换
        G6ModelChange(item) {
            this.graph.off(['click'],this.onMoveNode);
            this.graph.off(['click'],this.onAddTree);
            this.graph.off(['click'],this.onEditTitle);
            this.graph.off(['dblclick'],this.onDbClick);
            this.graph.removeBehaviour(['click']);
            this.graph.removeBehaviour(['dblclick']);
            if(item.value=='add') {
                this.graph.addBehaviour(['click']);
                this.graph.on('click', this.onAddTree);
            } else if(item.value=='edit') {
                this.graph.addBehaviour(['dblclick']);
                this.graph.on('dblclick', this.onDbClick);
            } else if(item.value=='update') {
            	this.graph.addBehaviour(['click']);
                this.graph.on('click', this.onEditTitle);
            }  else if(item.value=='delete') {
                this.graph.addBehaviour(['click']);
                this.graph.on('click', this.onMoveNode);
            } else if(item.value=='save') {
                if(this.state.isSave) {
                	const data = this.graph.save();
                	const handleData = this.handleSaveData(data);
    		    	this.setState({
    		            isSave: false,
    		        })
                	this.props.saveData(handleData);
                }
               
            }
        }

    // 数据处理模块（处理保存数据、生成树形结构数据、查找树形结构数据）
        // 处理保存数据
        handleSaveData(data) {
            let result = {};
            let source = data.source;
            let tempRoot = {
                gid: source.id,
                name: source.label?source.label:source.name,
            }
            if(source.children) {
               tempRoot["children"] =  this.createTreeData(source.children);
            }
            result = tempRoot;
            return result;
        }

        // 生成树形结构数据
        createTreeData(data) {
            let result = [],temp;
            if(data&&data.length>0) {
                 data.map((item,index)=>{
                    let obj = {};
                    obj.gid = item.id;
                    obj.name = item.label?item.label:item.name;
                    if(item.children) {
                        temp = this.createTreeData(item.children);
                        obj.children = temp;
                    }
                    result.push(obj);
                })
            }
            return result;
        }

        // 查找树形结构数据
        findTreeData(data,text) {
            let result = [],temp;
            data.map((item,index)=>{
                let obj = {};
                obj.gid = item.id;
                obj.name = item.label?item.label:item.name;
                if(obj.name.indexOf(text)>-1) {
                    result.push(obj.gid)
                }
                if(item.children) {
                    temp = this.findTreeData(item.children,text);
                    result.push(...temp)
                }
            })
            return result;
        }

    // 模态框操作事件
        /*
         * 这里进行数据编辑
         * onOpenModal(node)中将把选中的数据节点处理为：{text:text,id:id,pid:pid}
         * onCloseModal(close) 
         */
        // 模态框编辑
        onOpenModal(node) {
            if(!node){
              return;
            }
            this.graph.off(['dblclick'],this.onDbClick);
            let group = node.get('group');
            let label = group.findBy(this.findByClass);
            let text = label.attr('text');
            let model = node.get("model");
            let pid = model.root?'0':model.parent.id;
            let id = node.get("id");
            let sendData = {text:text,id:id,pid:pid}; // 传递出去的数据
            // 查找父级id
            this.setState({
                editVisible: true,
                node: node,
                modelData: {text:text,id:id,pid:pid},
            })
            this.props.onEditKnowledge(sendData);
        }

        // 添加节点模态框
        onOpenAddModal() {
            this.isStartKeyListener(false); // 停止tab按键切换
            this.setState({
                addVisible: true,
            })
        }

        // 关闭模态框
        onCloseModal(close) {
            if(close&&close.isEdit?true:false) {
                this.graph.on(['dblclick'],this.onDbClick);
            }
            this.isStartKeyListener(true); // 启动tab按键切换
            this.setState({
                editVisible: false,
                addVisible: false,
            })
        }

    // 其他工具（中心化节点，键盘监听事件，回车事件）
        // 中心化节点
        centerPoint(ev) {
            var node = ev.item;
            this.graph.focusPoint(node);
            this.graph.updateNodesPositon();
            this.graph.refresh();
        }

        // 键盘监听事件
        isStartKeyListener(isStart) {
            if(isStart) {
                window.addEventListener("keydown", this.toolChangeByKey, false);
            } else {
                window.removeEventListener("keydown", this.toolChangeByKey);
            }
        }

        // 回车事件
        onKeyDownInput(ev) {
            if(ev.keyCode === 13){
                ev.preventDefault();             
                ev.stopPropagation();
                this.updateLabel();
            }
        }

    render() {
        /*样式编辑*/
		const toolStyle = {
            position: 'absolute',
            top: '-65px',
            right:'0',
            padding:'10px 0',
            borderRadius: 4,
            textAlign: 'center',
        }

        const findStyle = {
            position: 'absolute',
            right: 28,
            padding:'10px 20px',
            textAlign: 'center',
        }

        const g6Wrapper = {
            border: '1px solid #999',
        }

        const helpStyle = {
            marginRight:'10px',
        }
        /*提示信息*/
        const helpContent = (
            <div>
                <ul>
                    <li>1. <strong>添加模式&nbsp;</strong>用于添加节点,鼠标单击模块就可以在下面创建新模块</li>
                    <li>2. <strong>编辑详情&nbsp;</strong>用于编辑节点详情内容,鼠标双击模块进行编辑，弹出模态框窗口</li>
                    <li>3. <strong>修改模式&nbsp;</strong>用于删除节点,鼠标单击模块修改对应的标题，回车保存数据</li>
                    <li>4. <strong>删除模式&nbsp;</strong>用于删除节点,鼠标单击模块就可以删除，删除数据无法撤回</li>
                    <strong>注意：</strong><em>默认为编辑模式，<strong>Tab键</strong>&nbsp;可以快速切换编辑模式</em>
                </ul>
            </div>
        )

                    // <li>5. <strong>保存数据</strong>将数据保存到浏览器缓存中</li>
        const { toolSelected,toolDefault,searchedArray,loading,isShowToolHealp,isRead } = this.state;
        const { onAddModalData } = this.props;

        if(toolSelected&&toolSelected.value) {
            this.G6ModelChange(toolSelected);
        }
        const closeModal = this.onCloseModal;
        // 模态框编辑窗口(编辑模式)
        const EditModalProps = {
            editVisible: this.state.editVisible,
            modelData: this.state.modelData,
            title: '编辑节点',
            node: this.state.node,
            onSubmitModal(data) {
                // console.log("onSubmitModal--------->",data);
            },
            onCancel:()=>this.onCloseModal({isEdit:true})
        }

        // 模态框添加窗口(添加模式)
        const AddModalProps = {
        	kbid: this.props.kbid,
            diaid: G6.Util.guid(),
            addVisible: this.state.addVisible,
            title: '新增根节点',
            onSubmitModal(data) {
                closeModal();
                // console.log("onSubmitModal---------------->",data)
                onAddModalData(data);
            },
            onCancel:()=>this.onCloseModal({isRoot:true})
        }

        /*数据信息*/
        const loopRadio = this.toolArr.map((item,index)=>{
            if(item.isUse) {
                return (
                    <Radio.Button key={index} value={item.value} onClick={() => this.onToolClick(item)}>
                        <Icon type={item.icon} />{item.label}
                    </Radio.Button>
                )
            }
        })
        return (
            <div>
                <Row type="flex" justify="center">
                    <Col>
                        <div style={toolStyle}>
                            {isShowToolHealp?<Popover content={helpContent} title="小提示" trigger="hover">
                                    <Button type="dashed" style={helpStyle} shape="circle" icon="question" />
                                </Popover>:null}
                            {!isRead?<RadioGroup size="large" value={toolSelected&&toolSelected.value?toolSelected.value:toolDefault.value}>
                                    {loopRadio}
                                </RadioGroup>:null}
                            
                        </div>
                    </Col>
                </Row>
                {this.state.isFind ? <Row type="flex" justify="end" style={findStyle}>
                        <Col>
                            <Button.Group>
                                <Button type="primary">第{this.state.findIndex}条</Button>
                                <Button type="dashed" onClick={()=>{this.onNextNode({findState:"left"})}}>
                                    <Icon type="left" />上一条
                                </Button>
                                <Button type="dashed" onClick={()=>{this.onNextNode({findState:"right"})}}>
                                    下一条<Icon type="right" />
                                </Button>
                                <Button type="primary" onClick={()=>{this.onCloseFind()}}>共{this.searchedArray.length}条<Icon type="close" /></Button>
                            </Button.Group>
                        </Col>
                    </Row>:null}
                <div id={this.graphId} style={g6Wrapper}>
                </div>
                {/* <EditModal {...EditModalProps} />  */}
                <AddModal {...AddModalProps} />
            </div>
        );
    }
  }

  // G6Component.propTypes = {
  //   data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  //   width: React.PropTypes.number.isRequired,
  //   height: React.PropTypes.number.isRequired,
  // };

G6Component.defaultProps = {
    data: {
        "id": "0",
        "name": "amisbook",
    }
};
export default G6Component;
