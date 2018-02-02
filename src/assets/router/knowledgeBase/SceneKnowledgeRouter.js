import React from 'react';
import { connect } 	from 'dva'
import SceneKnowledge from '../../components/knowledgeBase/sceneKnowledge/index'

function SceneKnowledgeRouter ({dispatch,loaction,sceneKnowledge}) {

	const { 
		loading,kbid,treeid,oldTreeid,isRead,
		sceneInfo,
		isAdd,isEditG6,isEditKnowledge,
		toolSelected,treeData,seacrhG6Info,kbPath 
	} = sceneKnowledge;

	const SceneKnowledgeProps = {
		loading:loading,
		kbid: kbid,
		treeid: treeid,
		oldTreeid: oldTreeid,
		sceneInfo,
		isRead, // 阅读模式
    	isAdd, // 用于判断新增还是修改
    	isEditG6, // 用于判断是否进行图形编辑，需要先获取到kb_id才可以
    	isEditKnowledge,
		toolSelected:toolSelected,
		treeData:treeData,
		seacrhG6Info:seacrhG6Info,
		kbPath:kbPath,
		onModelChange(item) {
			dispatch({
				type:'sceneKnowledge/modelChange',
				payload: item,
			})
		},
		onSeacrhG6(data) {
			dispatch({
				type:'sceneKnowledge/seacrhG6',
				payload: data,
			})
		},
		onSaveTree(data) {
			dispatch({
				type:"sceneKnowledge/saveTree",
				payload:data,
			})
		},
		onAddItem(item) {// 新增节点
			dispatch({
				type:"sceneKnowledge/addItem",
				payload:item,
			})
		},
		onUpdateItem(item) {// 修改节点
			dispatch({
				type:"sceneKnowledge/updateItem",
				payload:item,
			})
		},
		onAddRootItem(data) {
			let submit = {};
			let tempArr = [];
			let tempObj = {};
			tempObj['kb_id'] = data.kb_id;
			tempObj['dia_id'] = data.dia_id;
			tempObj['dia_title'] = data.name;
			tempObj['dia_pid'] = data.dia_pid;
			tempArr.push(tempObj);
			submit['dialog_info'] = tempArr;
			dispatch({
				type:"sceneKnowledge/addRootItem",
				payload:{
					submit: submit,
					data: data,
				},
			})
		},
		onChangeTree(data) {
			dispatch({
				type:"sceneKnowledge/changeTree",
				payload:data,
			})
		},
		onDelKbDialog(data) {
			dispatch({
				type:"sceneKnowledge/delKbDialog",
				payload:data,
			})
		},
		onSetKbid(data) {
			dispatch({
				type:"sceneKnowledge/setKbid",
				payload:data,
			})
		},
		onSetTreeid(treeid) {
			dispatch({
				type:"sceneKnowledge/setTreeid",
				payload:treeid,
			})
		},
		onSaveScene(data) {
			dispatch({
				type:"sceneKnowledge/saveScene",
				payload:data,
			})
		},
		onUpdateScene(data) {
			dispatch({
				type:"sceneKnowledge/updateScene",
				payload:data,
			})
		},
		onChangeEditKnowledge(isEditKnowledge) {
			dispatch({
				type:"sceneKnowledge/changeEditKnowledge",
				payload:isEditKnowledge,
			})
		},
	};

	return (
		<div>
			<SceneKnowledge { ...SceneKnowledgeProps } />
		</div>
	)
} 

export default connect(({sceneKnowledge})=>({sceneKnowledge}))(SceneKnowledgeRouter);
