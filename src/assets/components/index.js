/*index.js
	场景知识
	路由说明：
	参数： 
		toolSelected,	
		treeData,	树数据{"id":"root",name:"根节点",children:[{name:"子节点",id:"子id"}]} 	注意：子id没有的时候组件将为其插入8位随机字符id，有则用原id
		seacrhG6Info  搜索数据信息{isSearch: true|false , search: 搜索文字}
	方法：
		onModelChange() 模式改变{value:'edit/add/delete/save'}
		onSeacrhG6() 回调修改搜索状态{isSearch: true|false}
*/

import React from 'react';
import { message,Row, notification, Col } from 'antd';
import SceneHeader from './page/SceneHeader';
import SceneTree from './page/SceneTree';

import KbTreeLayout from './page/KbTreeLayout';

import SceneHeaderView from './viewPage/SceneHeaderView';

import styles from './sceneKnowledgeStyle.less';
import { hashHistory } from 'react-router';

const SceneKnowledge = ({
	loading,
	kbid,
	treeid,
	oldTreeid,
	sceneInfo,
	isRead, // 阅读模式
	isAdd, // 用于判断新增还是修改
	isEditG6, // 用于判断是否进行图形编辑，需要先获取到kb_id才可以
	isEditKnowledge,
	onModelChange,
	toolSelected,
	treeData,
	seacrhG6Info,
	onSeacrhG6,
	onSaveTree,
	onAddItem,
	onUpdateItem,
	onChangeTree,
	onAddRootItem,
	onDelKbDialog,
	onSetKbid,
	onSetTreeid,
	onSaveScene,
	onUpdateScene,
	onChangeEditKnowledge,
	kbPath,
}) => {
	const SceneHeaderProps = {
		isAdd,
		isRead,
		kbid,
		treeid,
		oldTreeid,
		sceneInfo,
		onSaveScene,
		onUpdateScene,
		kbPath,
	};

	const KbTreeLayoutProps = {
		treeid,
		oldTreeid,
		onSetTreeid,
	};

	const openNotification = (data,isRead) => {
		// isRead [true|false] 阅读模式|编辑模式
	  	/*notification.open({
		    message: '信息提示:knowledgeBase/sceneKnowledge/index.js',
		    description: JSON.stringify(data),
		});*/
		if(isRead){
			hashHistory.push("/knowledgeBase/KnowledgeSceneViewRoute/"+data.id);
		}else{	
			hashHistory.push("/knowledgeBase/SceneKnowledgeMainRouter/"+data.id);
		}
	};


	const SceneTreeProps = {
		loading,
		kbid,
		isRead,
    	isAdd, // 用于判断新增还是修改
    	isEditG6, // 用于判断是否进行图形编辑，需要先获取到kb_id才可以
    	isEditKnowledge, // 用于判断是否处于知识内容编辑状态
		onModelChange,
		toolSelected,
		treeData,
		seacrhG6Info,
		onSeacrhG6,
		onSaveTree,
		onAddItem,
		onAddRootItem,
		onUpdateItem,
		onChangeTree,
		onDelKbDialog,
		onSetKbid,
		onEditKnowledge(data) { //这里将携带信息进行跳转到知识内容页面进行跳转
			openNotification(data,isRead);
			onChangeEditKnowledge(1); // 勿删，用于赋予状态，1进入知识内容页面，2关闭知识内容页面
			// hashHistory.push("/yoururl");
			window.setTimeout(SceneTreeProps.onFinshKnowledge(),5000); 
		},
		onFinshKnowledge() {
			onChangeEditKnowledge(2);
		},
		onCancelKnowledge() {
			onChangeEditKnowledge(2);
		}
	}
	
	return (
		<div>
			<Row>
				<Col span={5}>
					<KbTreeLayout {...KbTreeLayoutProps} />
				</Col>
				<Col span={19} className={styles.SceneKnowledgeMain}>
					{isRead?<SceneHeaderView { ...SceneHeaderProps } />:<SceneHeader { ...SceneHeaderProps } />}
					<SceneTree {...SceneTreeProps} />
				</Col>
			</Row>
		</div>
	)
} 

export default SceneKnowledge;

