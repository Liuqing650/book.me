import { saveKnowledge,getKnowledgeDialogByDialogId,updateKnowledge,getKbSensitiveWords } from '../../services/knowledgeBase/sceneKnowledge/sceneKnowledgeMainService'
import { message, Button } from 'antd';
import { hashHistory } from 'react-router';




export default {
  namespace: 'sceneKnowledgeMainModel',  
  state: {      
            fileList:[],
            editorData:"",   //富文本
            tags: [],  //标签
            problemBzObj:{},
            problemList:[],//问题列表
            problemIds:[],
            dia_title:"",
            kb_id:"",
            dia_id:"",
            dia_pid:"",
            kb_path:"",            
            problemSenWord:[],
            contentSenWord:[]  
  },

  reducers: {      
      setStateList(state,action){
          console.log("setStateList==>",action.payload)          
          state.tags=action.payload.dialog_index_info;          
          state.kb_id=action.payload.dialog_info.kb_id;
          state.kb_path=action.payload.dialog_info.kb_path;
          state.dia_id=action.payload.dialog_info.dia_id;
          state.dia_title=action.payload.dialog_info.dia_title;
          state.dia_pid=action.payload.dialog_info.dia_pid;
          state.editorData=action.payload.dialog_info.dia_desc!=undefined?action.payload.dialog_info.dia_desc:"";

          //解析附件
          const attaInfos=action.payload.dialog_atta_info;
          let  attaInfosNew=[];
          for(let i=0;i<attaInfos.length;i++){
              attaInfosNew.push( {uid:attaInfos[i].atta_id,name:attaInfos[i].atta_name,status:'done',url:attaInfos[i].atta_url});
          }
          state.fileList=attaInfosNew;
          
          state.contentSenWord=[];            
          return {...state}; 
      },
      setQingkong(state,action){
        state.fileList=[];
        state.editorData="";   //富文本
        state.tags=[];  //标签
        state.problemBzObj={};
        state.problemList=[];//问题列表
        state.problemIds=[0];
        state.kb_title="";
        state.kb_id="";
        state.problemSenWord=[];
        state.contentSenWord=[];  
        return {...state}; 
      },
      setSensitiveWordsForProblem(state,action){
        state.problemSenWord=action.payload;
        state.editorData=action.editorData;
        state.fileList=action.fileList;
        return {...state}; 
      },
      setSensitiveWordsForContent(state,action){
        state.contentSenWord=action.payload;
        return {...state}; 
      },
      setTags(state,action){
        state.tags=action.payload;
        return {...state}; 
      }
      ,setFileList(state,action){
         state.fileList=action.payload;
         return {...state}; 
      },
      setContent(state,action){
         state.editorData=action.payload;
         return {...state}; 
      }
  },

  effects: {
      *query(action, { call, put, select }) {
        console.log("query--------------------");
        const kb_id=action.payload;
        const result = yield call(getKnowledgeDialogByDialogId,{dia_id:action.payload});
        console.log("query result==>",result);
        yield put({ type: 'setStateList', payload: result.data});
      },
      *saveKnowledge(action, { call, put, select }) {
          console.log("*********saveKnowledge",action);
          const addParams=action.payload;          
          const contentresult = yield call(getKbSensitiveWords,{content:addParams.dialog_info[0].dia_desc});
         
          if(contentresult.data.length>0){
             yield put({ type: 'setSensitiveWordsForContent', payload: contentresult.data});
              message.info('内容有敏感词，请修改!');
              return;
          }
          const stateData = yield select(({sceneKnowledgeMainModel})=>({sceneKnowledgeMainModel}));

          if(stateData.sceneKnowledgeMainModel.tags.length===0){ //添加标签
            action.knowledgeLabelModal.showModal();
            return;
          }
          
          console.log("save--",addParams);
          console.log("save-- json String",JSON.stringify(addParams))
          
          const result = yield call(updateKnowledge,addParams);
          console.log("修改场景知识:",result)

          hashHistory.push("/knowledgeContent/sceneKnowledge?kb_id="+stateData.sceneKnowledgeMainModel.kb_id);

          /*if(result.data==='saveOk'){ 
            hashHistory.push("/knowledgeBase/index/list");
          }else{
            message.info('保存图文知识失败，请联系管理员!');
          } */ 

      }
      ,*getTreeId(action, { call, put, select }) {
        yield put({ type: 'setTreeId', payload: action.payload});
      }
      ,*qingkong(action, { call, put, select }) {
        yield put({ type: 'setQingkong', payload: action.payload});
      }
      ,*checkSensitiveWordsForProblem(action, { call, put, select }) {        
          const result = yield call(getKbSensitiveWords,action.payload);
          console.log("checkSensitiveWordsForProblem==>",result);
          yield put({ type: 'setSensitiveWordsForProblem', payload: result.data});
      }
      ,*checkSensitiveWordsForContent(action, { call, put, select }) {        
        const result = yield call(getKbSensitiveWords,action.payload);
        yield put({ type: 'setSensitiveWordsForContent', payload: result.data});
      }

      ,*getTags(action, { call, put, select }) {
          console.log("getTags--------------",action.payload);
          yield put({ type: 'setTags', payload: action.payload});

      }

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const path=location.pathname;
        //console.log(path);        
        const params=path.split("/");
        //console.log(params);

        const id=params[3];
        if (params[2] === 'SceneKnowledgeMainRouter' || params[2] === 'KnowledgeSceneViewRoute') {

            dispatch({
              type: 'query',
              payload: id,
            })
            
        }
      })
    },
  }

};
