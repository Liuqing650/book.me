import {message} from 'antd'
import {
    getKnowledgeDialogByKbid,getKnowledgeInfoByKbid,
    saveKbDialogInfo, updateKbDialogInfo, updateKbDialogTitle, delKbDialog,
} from '../../services/knowledgeBase/sceneKnowledge/sceneKnowledgeService'



export default {
	namespace:'sceneKnowledge',

	state:{
        loading: false,
        kbid: null,
        isRead: false,
        isAdd: true,
        isEditKnowledge: 2, // 1|2 1表示开启，2表示关闭知识内容页面的编辑
        isEditG6: false,
        treeid: null,
        oldTreeid: null,
        kbPath:"",
        isUpdate: false,
        sceneInfo: {},
        // 场景知识树
        originalData:{},
		toolSelected:{},
        seacrhG6Info:{},
		treeData : {},
	},

	subscriptions:{
		setup({ dispatch, history }) {
            history.listen(location => {
                if(location.pathname === '/knowledgeContent/sceneKnowledge') {
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
            let isEdit = false;
            if(payload.kb_id) {
                isEdit = true;
            }
            yield put({
                type:'changeIsRead',
                payload: payload.isRead?true:false
            })
            if(isEdit) {
                // let obj = {"kb_id":"1d86ad1b65b04a019a1a756d1c75a51e"}
                const recordDialog = yield call(getKnowledgeDialogByKbid,payload);
                const recordInfo = yield call(getKnowledgeInfoByKbid,payload);

                // console.log("recordDialog*********",recordDialog);
                // console.log("recordInfo*********",recordInfo);


                if(recordDialog&&recordInfo) {
                    yield put({
                        type:'querySuccess',
                        payload: {
                            dialog: recordDialog.data,
                            info: recordInfo.data,
                            kbId: payload.kb_id,
                        },
                    }) 
                }
            } else {// 新增场景
                yield put({
                    type:'initSceneKnowledgeData',
                }) 
            }
        },
        *addItem({ payload }, { call, put }) {
            message.loading('数据保存中..', 0);
            const record = yield call(saveKbDialogInfo,payload);
            if(record) {
                message.destroy();
                message.success('新增成功..', 1);
                // console.log("record------------>",record);
            }
        },
        *addRootItem({ payload }, { call, put }) {
            message.loading('数据保存中..', 0);
            // console.log("payload----------->",payload);
            const record = yield call(saveKbDialogInfo,payload.submit);
            if(record) {
                message.destroy();
                message.success('新增成功..', 1);
                yield put({
                    type:"changeTree",
                    payload: payload.data
                })
            }
        },
        *updateItem({ payload }, { call, put }) {
            message.loading('数据保存中..', 0);
            const record = yield call(updateKbDialogTitle,payload);
            if(record) {
                message.destroy();
                message.success('修改成功..', 1);
            }
        },
        *saveScene({ payload }, { call, put }) {
            //message.loading('数据保存中..', 0);
            const record = yield call(saveKbDialogInfo,payload);
            if(record.data) {
                message.success('保存场景名称成功!', 2);
                //message.destroy();
                let data = record.data;
                yield put({
                    type:'initSceneKnowledgeData',
                }) 
                yield put({
                    type:"setKbid",
                    payload: data.saveKnowledgeOK?data.saveKnowledgeOK:payload.kb_main[0].kb_id
                })
            }
        },
        *updateScene({ payload }, { call, put }) {
            //message.loading('数据保存中..', 0);
            const record = yield call(updateKbDialogInfo,payload);
            if(record.data) {
                message.success('修改场景名称成功!', 2);
                //message.destroy();

                let data = record.data;
                yield put({
                    type:"setKbid",
                    payload: data.updateKnowledgeOK?data.updateKnowledgeOK:payload.kb_main[0].kb_id
                })
            }
        },
        *saveTree({ payload }, { call, put }) {
            message.loading('数据保存中..', 3);

            // const data = yield call(saveKbDialogInfo,payload);
            if(false) {
                message.destroy();
            }
            yield put({type:"hideLoading"});
            // console.log("payload------------>",payload);
        },
        *delKbDialog({ payload }, { call, put }) {
            message.loading('节点删除中..', 0);
            const record = yield call(delKbDialog,payload);
            if(record.data) {
                message.destroy();
            }
        },
	},

	reducers:{
		querySuccess(state,action) {

            let payload = action.payload;
            console.log("payload--------------------->",payload);
            let arrKey = "dialog_info";
            let aminInfo = "main_info";
            let arrChildKey = "dia_atta_info"; //子节点识别符
            let desc = "dia_desc";
            let treeid = "tree_id";
            let diaid = "dia_id";
            let diapid = "dia_pid";
            let kbid = "kb_id";
            let kbtitle = "kb_title";
            let kbtype = "kb_type";
            let diatitle = "dia_title";
            let dialog = payload.dialog[arrKey];
            let info = payload.info[aminInfo];
            let sceneInfo = info;
            state.originalData = dialog;
            state.sceneInfo = sceneInfo;
            // console.log("state.sceneInfo--------------------->",state.sceneInfo);
            function loopTree(data, pid) {
                if(!pid){
                    pid=0;
                }
                var result = [], temp;
                data.map((item)=>{
                    if(item[diapid]==pid) {
                        let obj={};
                        obj['id'] = item[diaid];
                        obj['name'] = item[diatitle];
                        temp = loopTree(data,item[diaid]);
                        if (temp.length > 0) {
                            obj.children = temp;
                        }
                        result.push(obj);
                    }
                })
                return result;
            }
            state.kbid = info[kbid];
            state.oldTreeid = info[treeid];
            let tempArr = loopTree(dialog);
            // console.log("tempArr---------->",tempArr);
            state.treeData = tempArr&&tempArr.length>0?tempArr[0]:{};
            state.isAdd = false; // 修改数据
            state.kbPath=info.kb_path;
    		return { ...state };
    	},
        initSceneKnowledgeData(state,action) {
            state.treeData = {};
            state.sceneInfo = {};
            state.kbPath="";
            state.isAdd = true; // 新增数据
            return { ...state };
        },
        modelChange(state,action) {
          state.toolSelected = action.payload;
          return { ...state };
        },
        seacrhG6(state,action) {
            state.seacrhG6Info = action.payload;
            return { ...state };
        },
        changeTree(state,action) {
            state.treeData = action.payload;
            return { ...state };
        },
        showLoading(state,action) {
            state.loading = false;
            return { ...state };
        },
		hideLoading(state,action) {
			state.loading = false;
			return { ...state };
		},
        setKbid(state,action) {// 新增树时重新创建kbid
            state.kbid = action.payload;
            return {...state};
        },
        setTreeid(state,action) {// 新增树时锁定treeid
            state.treeid = action.payload;
            return {...state};
        },
        changeEditKnowledge(state,action) {// 双击页面进行跳转的时候的状态记录
            state.isEditKnowledge = action.payload;
            return {...state};
        },
        changeIsRead(state,action) {// 阅读模式
            state.isRead = action.payload;
            return {...state};
        }
	}
}