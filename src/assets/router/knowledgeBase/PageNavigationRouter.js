import React from 'react';
import { connect } 	from 'dva';
import {message} from 'antd'
import PageNavigation from '../../components/knowledgeBase/pageNavigation/index'

function PageNavigationRouter ({dispatch,loaction,pageNavigation}) {

	const { 
		loading, tipVisible, knowledgeList, isSubmit,
		isAdd,kbid,mainInfo,isRead,
		treeid,oldTreeid,
		problemBzObj, problemList, problemIds, problemSenWord, isSensitive, isSubmitSensitive,
		tags, isShowModal,editorData,
		navigitionList,selectTreeValue,
		buttonInfo,selectButtonInfo,isSubmitLoading,
	} = pageNavigation;

	const PageNavigationProps = {
		loading,
		isSubmit,
		isAdd,
		treeid,
		oldTreeid,
		tipVisible,
		isSensitive,
		isSubmitSensitive,

		kbid,
		isRead,
		mainInfo,

		tags,
		editorData,
		isShowModal,

		problemBzObj,
		problemList,
		problemIds,
		problemSenWord,
		knowledgeList,
		navigitionList,
		selectTreeValue,

		
		buttonInfo,
		selectButtonInfo,
		isSubmitLoading,
		onTreeChange(tree) {
			dispatch({
				type:'pageNavigation/setTreeid',
				payload: tree,
			})
		},
		onProblemChange(problemList) {
			dispatch({
				type:'pageNavigation/problemChange',
				payload:problemList,
			})
		},
		onSensitiveProblem(problemList) {
    		//  先进行敏感词排除
    		dispatch({
				type:'pageNavigation/sensitive',
				payload:problemList,
			})
		},
		onSubmitProblem(problemList) {
    		//  先进行敏感词排除
    		dispatch({
				type:'pageNavigation/problemChange',
				payload:problemList,
			})
		},
		onSubmitData(data) {
			if(isAdd) {
				dispatch({
					type: 'pageNavigation/saveKnowledge',
					payload:data,
				})
			} else {
				dispatch({
					type: 'pageNavigation/updateKnowledge',
					payload:data,
				})
			}
		},
		onSelectTreeChange(data) {
			dispatch({
				type:'pageNavigation/selectTreeChange',
				payload:data,
			})
		},
		onNavigationTreeChange(data) {
			dispatch({
				type:'pageNavigation/navigationTreeChange',
				payload:data,
			})
		},
		onChangeTip(isShow) {
			dispatch({
				type:'pageNavigation/changeTip',
				payload:isShow,
			})
		},
		onChangeTags(tags) {
			dispatch({
				type:'pageNavigation/changeTags',
				payload:tags,
			})
		},
		onChangeSensitive(sensitive) {
			dispatch({
				type:'pageNavigation/changeSensitive',
				payload:sensitive,
			})
		},
		onChangeTagsModal(isShow) {
			if(treeid!=null) {
				dispatch({
					type:'pageNavigation/changeTagsModal',
					payload:isShow,
				})
			} else {
				message.info("您还没有选择应用。")
			}
			
		},
		onChangeButtonState(index,isActive) {
			dispatch({
				type:'pageNavigation/changeButtonState',
				payload:{
					index:index,
					isActive:isActive
				},
			})
		},
		onChangeSubmit(index) {
			if(index === 3) {
				dispatch({
					type:'pageNavigation/changeButtonState',
					payload:{
						index:index,
						isActive:true
					},
				})
			}
			dispatch({
				type:'pageNavigation/changeSubmit',
				payload:index===9?false:true,
			})
		},
		onInitState() {
			dispatch({
				type:'pageNavigation/initState',
			})
		},
		onChangeSider(isLeft) {
			dispatch({
				type:'pageNavigation/changeSider',
				payload: isLeft
			})
		},
	};

	return (
		<div>
			<PageNavigation { ...PageNavigationProps } />
		</div>
	)
} 

export default connect(({pageNavigation})=>({pageNavigation}))(PageNavigationRouter);
