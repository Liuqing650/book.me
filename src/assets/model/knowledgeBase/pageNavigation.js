import {message} from 'antd'
import {
    getKnowledgeList, getKBNaveTree,saveKnowledge,updateKnowledge,getKBTreeByID,
} from '../../services/knowledgeBase/pageNavigation/pageNavigationService';

import { getKnowledgeInfoByKbid,getKbSensitiveWords } from '../../services/knowledgeBase/graphicKnowledge/GraphicKnowledgeService'
import { hashHistory } from 'react-router';

export default {
    namespace:'pageNavigation',

    state:{
        loading: false,
        isSubmit: false,
        isLeft: false,  // 用于判断操作问题
        tipVisible: false,
        treeid: null,
        oldTreeid: null,
        // 数据参数
        kbid:"",
        isRead: false,
        isAdd: false,
        knowledgeInfo:[],
        mainInfo:{},
        // 标准问题
        isSensitive: true, // 默认为存在敏感词汇
        isSubmitSensitive: false,
        // 知识标签
        isShowModal: false,
        editorData: "",

        // 页面导航
        knowledgeList: [],
        navigitionList:[],
        tags:[],    // 标签
        selectTreeValue:"",
        // 相似问题
        problemBzObj:{},// 标准问题
        problemList:[],//问题列表
        problemIds:[],
        problemSenWord:[],

        // 页面提交事件
        buttonInfo: [{index:1,isActive: false},{index:2,isActive: false},{index:3,isActive: false}], // 1知识问题,2知识标签，3.知识内容
        selectButtonInfo: {index:1,name:'检测敏感词'},
        isSubmitLoading: false,
    },

    subscriptions:{
        setup({ dispatch, history }) {
            history.listen(location => {
                if(location.pathname === '/knowledgeContent/navigition') {
                    dispatch({
                      type: 'query',
                      payload:location.query
                    })
                }
            })
        }
    },

    effects:{
        *query({ payload }, { call, put }) {
            yield put({type:'showLoading'});
            let knowledgeInfo = null;
            let isAdd = true;
            if(payload&&payload.kb_id) { // 判断新增|修改
            	isAdd = false;
            }
            yield put({
                type:'changeIsRead',
                payload: payload.isRead?true:false
            })
            if(isAdd) {// 添加
            	let kblist = yield call(getKnowledgeList,{});
	            let navigitionList = yield call(getKBNaveTree,{"menu_pid":"0"})
	            if(kblist.data&&navigitionList.data) {
	                yield put({type:'hideLoading'});
                    yield put({ 
                        type: 'changeButtonState', 
                        payload:{
                            index:4,
                            isActive:false
                        },
                    });
	                yield put({
	                    type:'querySuccess',
	                    payload: {
	                        kblist:kblist.data,	// 左边数据导航
	                        navigitionList:navigitionList.data,
	                        isAdd: isAdd,
	                    },
	                })
	            }
            } else { // 修改
            	let kblist = yield call(getKnowledgeList,{});
            	let knowledgeInfo = yield call(getKnowledgeInfoByKbid,payload);

	            if(kblist.data&&knowledgeInfo.data) {
	            	// let menu_id = knowledgeInfo.data.main_info.kb_appnavid;

	                yield put({type:'hideLoading'});
                    const navigitionList = yield call(getKBNaveTree,{"menu_pid":"0"});
	            	if(navigitionList&&navigitionList.data) {
                        yield put({ 
                            type: 'changeButtonState', 
                            payload:{
                                index:5,
                                isActive:true
                            },
                        });
	            		yield put({
		                    type:'querySuccess',
		                    payload: {
		                        kblist:kblist.data, 
		                        navigitionList:navigitionList.data, // 知识内容的数据导航
		                        knowledgeInfo: knowledgeInfo.data,	// 页面导航数据
		                        mainInfo: knowledgeInfo.data.main_info, // main_info的数据
		                        isAdd: isAdd,
		                    },
		                })
	            	}
	            }
            }
        },
        *saveKnowledge(action, { call, put, select }) {
            const addParams=action.payload;
            // console.log("payload=============>",addParams); 

            const result = yield call(saveKnowledge,addParams);
            if(result.data==='saveOk') {
                yield put({ type: 'changeSubmit',payload: false});
                yield put({ 
                    type: 'changeButtonState', 
                    payload:{
                        index:3,
                        isActive:true
                    },
                });
                hashHistory.push("/knowledgeBase/index/list");
            }else{
              message.info('保存导航信息失败，请联系管理员!');
            }
          
      },
      *updateKnowledge(action, { call, put, select }) {
            const addParams=action.payload;
            // console.log("updateKnowledge=============>",addParams); 
            const result = yield call(updateKnowledge,addParams);
            if(result.data==='update Ok') {
            	yield put({ type: 'changeSubmit',payload: false});
	            yield put({ 
	                type: 'changeButtonState', 
	                payload:{
						index:3,
						isActive:true
					},
	            });
                hashHistory.push("/knowledgeBase/index/list");
            }else{
                message.info('保存导航信息失败，请联系管理员!');
                yield put({ 
                    type: 'changeButtonState', 
                    payload:{
                        index:3,
                        isActive:false
                    },
                });
            }
        },
        *sensitive(action, {call,put}) { // 处理敏感词汇
            let problemList = action.payload;
            //问题敏感词判断
            let problemContent="";
            for(let i=0;i<problemList.length;i++){
                problemContent=problemContent+problemList[i].quest_desc+",";
            }
            const proresult = yield call(getKbSensitiveWords,{content:problemContent});

            if(proresult&&proresult.data.length>0){
                // console.log("proresult=========>",proresult.data);
                message.info('问题有敏感词，请修改!');
                yield put({ 
                    type: 'filterSensitiveSuccess', 
                    payload: {
                        isSensitive: true,
                        problemList: problemList,
                        problemSenWord: proresult.data
                    }
                });
                yield put({type:'changeButtonState',payload:{index:1,isActive:false}})
            } else {
                message.success('敏感词检测成功,无敏感词汇!');
                yield put({ 
                    type: 'filterSensitiveSuccess', 
                    payload: {
                        isSensitive: false,
                        problemList: problemList
                    }
                });
                yield put({type:'changeButtonState',payload:{index:1,isActive:true}})
            }
        }
    },

    reducers:{
        querySuccess(state,action) {
        	let isAdd = action.payload.isAdd;
        	state.isAdd = isAdd;
            // console.log("querySuccess======isAdd===========>",action.payload);
        	if(isAdd) { // 添加
        		const main_info={};
		        main_info.kb_id="";
		        main_info.tree_id="";
		        main_info.kb_type="1003",
		        main_info.kb_title="",
		        main_info.kb_content="",
		        main_info.kb_creater="sdf",
		        main_info.kb_state="",
		        main_info.kb_url="",
		        main_info.kb_appnavid="",
		        main_info.kb_filename="",
		        main_info.kb_outfile="",
		        main_info.kb_check_key="",
		        main_info.kb_hot="";
		        main_info.kb_index="";
		        state.mainInfo = main_info;
        		state.knowledgeList = action.payload.kblist;
            	state.navigitionList = action.payload.navigitionList;

                // 清空数据
                state.problemIds = [];
                state.kbid = "";
                state.editorData = "";
                state.problemBzObj = {};
                state.problemSenWord=[];
                state.knowledgeInfo = {};
                state.tags = [];
                state.selectTreeValue = "";
                state.treeid = "0";
        	} else { //修改
        		let knowledgeInfo = action.payload.knowledgeInfo;
        		let problemList = knowledgeInfo.question_info;//问题列表

            	// console.log("knowledgeInfo-------------->",knowledgeInfo);
        		// 数据处理

                let menu_id = knowledgeInfo.main_info.kb_appnavid;
                let menu_name = knowledgeInfo.main_info.menu_name;

                console.log("menu_id==========>",menu_id);
				let problemBzObj = {};
				let problemIds = [];
				problemBzObj['quest_id'] = knowledgeInfo.main_info.kb_id;
				problemBzObj['quest_type'] = knowledgeInfo.main_info.kb_type;
				problemBzObj['quest_desc'] = knowledgeInfo.main_info.kb_title;

        		state.problemBzObj = problemBzObj;// 标准问题
        		state.problemList = problemList;//问题列表
        		if(problemList&&problemList.length>0) {
	                problemList.map((item)=>{
                        problemIds.push(item.quest_id);
	                })
	            }
                let newNavigitionList = checkIsTreeId(action.payload.navigitionList,menu_id,menu_name);

                let problemContent="";
                problemContent = knowledgeInfo.main_info.menu_name+",";
                if(problemBzObj.quest_desc&&problemBzObj.quest_desc!="") {
                    problemContent = problemContent+problemBzObj.quest_desc+",";
                }
                if(problemList&&problemList.length>0) {
                    for(let i=0;i<problemList.length;i++){
                        problemContent=problemContent+problemList[i].quest_desc+",";
                    }
                }
                state.editorData = problemContent;

        		state.problemIds = problemIds;
        		state.kbid = knowledgeInfo.main_info.kb_id;
        		state.knowledgeList = action.payload.kblist;
            	state.navigitionList = newNavigitionList;
            	state.knowledgeInfo = knowledgeInfo;
            	state.tags = knowledgeInfo.index_info;
            	state.mainInfo = action.payload.mainInfo;

            	state.selectTreeValue = knowledgeInfo.main_info.kb_appnavid;
            	state.treeid = knowledgeInfo.main_info.tree_id;
        	}

            // 判断选择的tree是否在当前的树下
            function checkIsTreeId(list,id,name) {
                let result=[];
                let isHas = false;
                list.map((item)=>{
                    if(item.menu_id==id) {
                        isHas = true;
                    }
                })
                if(!isHas) {
                    let obj = {};
                    obj['menu_id'] = id;
                    obj['menu_pid'] = '0';
                    obj['isLeaf'] = '1';
                    obj['menu_name'] = name;
                    obj['insert'] = true;
                    result.push(obj);
                }
                list.map((item)=>{
                    result.push(item);
                })
                return result;
            }

            // console.log("querySuccess=================>",state.treeid);
            return { ...state };
        },
        filterSensitiveSuccess(state,action) {
            let isSensitive = action.payload.isSensitive;
            
            let problemIds = [];
            let problems=[];
            let problemList = action.payload.problemList;

            if(problemList&&problemList.length>0) {
                problemList.map((item)=>{
                    if(item.quest_type===1 || item.quest_type==="1") {
                        state.problemBzObj = item;
                    } else {
                        problemIds.push(item.quest_id);
                        problems.push(item);
                    }

                })
            }
            if(isSensitive) {
                state.problemSenWord = action.payload.problemSenWord;
            } else {
                state.problemSenWord = [];
            }
            state.problemList=problems;
            state.problemIds=problemIds;


            state.isSubmitSensitive = true;
            state.isSubmit =  !isSensitive; // 修改提交状态
            state.isSensitive = isSensitive; // 修改敏感词状态
            state.tipVisible = isSensitive; // 修改提示状态
            return { ...state };
        },
        setExpand(state,action) {
            state.expandedKeys = action.payload;
            autoExpandParent = false;
            return { ...state };
        },
        treeChange(state,action) {
            state.knowledgeList = [...action.payload];
            return {...state};
        },
        setKbid(state,action) {// 新增树时重新创建kbid
            state.kbid = action.payload;
            return {...state};
        },
        setTreeid(state,action) {// 新增树时锁定treeid
            state.treeid = action.payload;
            return {...state};
        },
        selectTreeChange(state,action) {
            state.selectTreeValue = action.payload;
            return {...state};
        },
        navigationTreeChange(state,action) {
            // 判断时候有必要去除原对象
            let navigitionList = state.navigitionList;
            navigitionList = [...action.payload];
            function checkisInsert(list) {
                let result=list;
                let temp = [];
                let insertItem = {};
                let isHas = false;
                list.map((item,index)=>{
                    if(item.insert) {
                        insertItem = item;
                    } else {
                        temp.push(item);
                    }
                })
                const setIsHas = (state) => { isHas = state;}
                const loopNavigition = (data,child) => data.map((item)=>{
                    if(item.menu_id==child.menu_id) {
                        setIsHas(true);
                    } 
                    if(item.children) {
                        loopNavigition(item.children,child);
                    }
                })
                loopNavigition(temp,insertItem);
                if(isHas) { 
                    result = temp; 
                }
                return result;
            }
            if(state.isAdd) { // 新增
                state.navigitionList = navigitionList;
            } else { // 修改
                state.navigitionList = checkisInsert(navigitionList);
            }
            return {...state};
        },
        problemChange(state,action) {
            let problemIds = [];
            let problems=[];
            let problemList = action.payload;
            if(problemList&&problemList.length>0) {
                problemList.map((item)=>{
                    if(item.quest_type===1 || item.quest_type==="1" ) {
                        state.problemBzObj = item;
                    } else {
                        problemIds.push(item.quest_id);
                        problems.push(item);
                    }
                })
            }
            // console.log('problemBzObj--------->',state.problemBzObj);
            state.problemList=problems;
            state.problemIds=problemIds;
            return {...state};
        },
        changeSensitive(state,action) { // 改变铭感词汇状态
            state.isSensitive = action.payload;
            state.tipVisible = action.payload;
            return {...state};
        },
        changeSubmit(state,action) { // 改变提交状态    
            state.isSubmit = action.payload;
            return { ...state };
        },
        changeButtonState(state,action) { // 接收index参数1,2,3 特殊：4全体修改状态
            // console.log('action.payload------------>',action.payload);
            let tempArr = state.buttonInfo;
            let tempIndex = action.payload.index;
            let tempIsActive = action.payload.isActive?action.payload.isActive:false;
            let newButtonInfo = [];
            if(tempIndex) {
                newButtonInfo = change(tempArr,tempIndex,tempIsActive);
            }
            function change(arr,tempIndex,tempIsActive) {
                let result = [];
                result = arr;
                if(arr&&arr.length>0) {
                    if(tempIndex<4) {
                        arr.map((item,index)=>{
                            if(item.index == tempIndex) {
                                if(item.index === 1) {
                                    state.isSensitive = !tempIsActive;
                                }
                                if(item.index <3) {
                                    result[2].isActive = false;
                                }
                                result[index].isActive = tempIsActive;
                            }
                        })
                    } else if(tempIndex===4) {
                        arr.map((item,index)=>{
                          state.isSensitive = !tempIsActive;
                          result[index].isActive =  tempIsActive;  
                        })                 
                    } else if(tempIndex===5) {
                        arr.map((item,index)=>{
                            if(item.index <3) {
                                state.isSensitive = !tempIsActive;
                                result[index].isActive =  tempIsActive; 
                            }
                        })                 
                    }
                }
                return result;
            }

            // 获取按钮上一步数据{index:1,name:'检测敏感词'};
            let before = state.selectButtonInfo;
            // 判断执行那一步数据
            function isSelectedButtonInfo(infoArr,select,tempIndex,tempIsActive) {
                let result = select;
                if(infoArr[0].index===1&&!infoArr[0].isActive) {
                    result.index = infoArr[0].index;
                    result.name = '检测敏感词';
                    state.isSubmitSensitive = false;   // 用于检测是否已经提交敏感词，避免出现二次敏感词检查BUG
                } else if( 
                        (infoArr[0].index===1&&infoArr[0].isActive) && 
                        (infoArr[1].index===2&&!infoArr[1].isActive) 
                    ) {
                    result.index = infoArr[1].index;
                    result.name = '新增标签';
                } else if( 
                        (infoArr[0].index===1&&infoArr[0].isActive) && 
                        (infoArr[1].index===2&&infoArr[1].isActive) &&
                        (infoArr[2].index===3&&!infoArr[2].isActive)
                    ) {
                    result.index = infoArr[2].index;
                    result.name = '保存数据';
                }  else if( 
                        (infoArr[0].index===1&&infoArr[0].isActive) && 
                        (infoArr[1].index===2&&infoArr[1].isActive) &&
                        (infoArr[2].index===3&&infoArr[2].isActive)
                    ) {
                    result.index = 4;
                    result.name = '保存成功';
                } else {
                    result.index = infoArr[0].index;
                    result.name = '检测敏感词';
                }
                return result;
            }

            state.selectButtonInfo = isSelectedButtonInfo(newButtonInfo,before);

            // console.log('state.selectButtonInfo------------>',state.selectButtonInfo);
            state.buttonInfo = newButtonInfo;
            return { ...state };
        },
        changeTip(state,action) {
            state.tipVisible = action.payload;
            return { ...state };
        },
        changeTags(state,action) {
            // console.log("action.payload------------>",action.payload);
            // const tags = state.tags.filter(tag => tag !== action.payload);
            state.tags = [...action.payload]
            return { ...state };
        },
        changeTagsModal(state,action) {
            let editorData = "";
            let isShowModal = false;
            let selectTreeValue = state.selectTreeValue;
            let problemBzObj = state.problemBzObj;
            let navigitionList = state.navigitionList;
            // 获取页面导航选中的信息
            function loopNavigition(treeList,selectid,isRun) {
                let result = {};
                if(isRun) {
                   treeList.map((item,index)=>{
                        if(item.menu_id==selectid) {
                            result = item;
                            isRun = false;
                        }
                        if(item.children) {
                            let obj = {};
                           obj = loopNavigition(item.children,selectid,isRun);
                           if(obj.menu_id==selectid) {
                                result = obj;
                           }
                        }
                    })
                }
                return result;
            }
            let navigation = loopNavigition(navigitionList,selectTreeValue,true);
            if(action.payload) {// 打开模态框
                let isPass = true;
                // 判断内容是否选中
                if(!selectTreeValue||(selectTreeValue==""&&selectTreeValue==null)) {
                    isPass = false;
                    message.error("您的导航菜单还没有选择,请先选择导航菜单.")
                }

                if(!problemBzObj.quest_id||problemBzObj.quest_desc==""||problemBzObj.quest_desc==null) {
                    isPass = false;
                    message.error("您的知识问题没有填写,请先填写知识问题.")
                }
                // 导航拼装
                if(isPass) {
                    isShowModal = true;
                    let problemContent="";
                    let problemList = state.problemList;
                    problemContent = navigation.menu_name+",";
                    if(problemBzObj.quest_desc&&problemBzObj.quest_desc!="") {
                        problemContent = problemContent+problemBzObj.quest_desc+",";
                    }
                    if(problemList&&problemList>0) {
                        for(let i=0;i<problemList.length;i++){
                            problemContent=problemContent+problemList[i].quest_desc+",";
                        }
                    }
                    editorData = problemContent;
                } else {
                    isShowModal = false;
                }
                // console.log("editorData-------------->",editorData);
                state.editorData = editorData;
            }
            state.isShowModal = isShowModal;
            return { ...state };
        },
        showLoading(state,action) {
            state.loading = true;
            return { ...state };
        },
        hideLoading(state,action) {
            state.loading = false;
            return { ...state };
        },
        initState(state,action) { // 这里将进行所有的状态初始化.
            state.selectButtonInfo = {index:1,name:'检测敏感词'};
            state.tipVisible = false;
            state.isSubmit = false;
            state.isShowModal = false;
            state.isSensitive = false;
            state.isSubmitLoading = false;
            state.loading = false;
            return { ...state };
        },
        changeSider(state,action) {
            state.isLeft = action.payload;
            return { ...state };
        },
        changeIsRead(state,action) {// 阅读模式
            state.isRead = action.payload;
            return {...state};
        }
    }
}