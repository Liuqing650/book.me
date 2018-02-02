import { saveKnowledge,getKnowledgeInfoByKbid,updateKnowledge,getKbSensitiveWords } from '../../services/knowledgeBase/graphicKnowledge/GraphicKnowledgeService'
import { message, Button } from 'antd';
import { hashHistory } from 'react-router';




export default {
  namespace: 'graphicKnowledgeModel',  
  state: {      
            fileList:[],
            editorData:"",   //富文本
            tags: [],  //标签
            problemBzObj:{},
            problemList:[],//问题列表
            problemIds:[],
            kb_title:"",
            kb_id:"",
            tree_id:"",
            problemSenWord:[],
            contentSenWord:[],
            kb_path:"", 
  },

  reducers: {      
      setStateList(state,action){
          //state.medicineList=action.payload.medicineList ;
          // console.log("setStateList==>",action.payload)
          //解析标签
         // state.tags=action.payload.main_info.kb_index;
          //state.tags=[{id:"1",name:"test"}];

          state.tags=action.payload.index_info!=undefined?action.payload.index_info:[];
          
          state.kb_title=action.payload.main_info.kb_title;
          state.tree_id=action.payload.main_info.tree_id;
          state.kb_id=action.payload.main_info.kb_id;
          state.kb_path=action.payload.main_info.kb_path;
          state.editorData=action.payload.main_info.kb_content;

          //解析附件
          const attaInfos=action.payload.atta_info!=undefined?action.payload.atta_info:[];
          let  attaInfosNew=[];
          for(let i=0;i<attaInfos.length;i++){
              attaInfosNew.push( {uid:attaInfos[i].atta_id,name:attaInfos[i].atta_name,status:'done',url:attaInfos[i].atta_url});
          }
          state.fileList=attaInfosNew;

          //解析问题
          let problemIds=[];
          let problems=[];
          const question_info=action.payload.question_info;
          for(let i=0;i<question_info.length;i++){
            if(question_info[i].quest_type===1 || question_info[i].quest_type==='1'){
              state.problemBzObj=question_info[i];
            }else{
              problems.push(question_info[i]);
              problemIds.push(question_info[i].quest_id)
            }
          }
          state.problemList=problems; 
          state.problemIds=problemIds;
          state.problemSenWord=[];
          state.contentSenWord=[];  
          
          return {...state}; 
      },
      setTreeId(state,action){
        state.tree_id=action.payload.treeId;
        return {...state}; 
      },
      setStateForAdd(state,action){
        state.fileList=action.payload.atta_info;
        state.editorData=action.payload.main_info.kb_content;   //富文本
        state.problemList=action.payload.question_info;//问题列表
        state.kb_title=action.payload.main_info.kb_title;
        return {...state}; 
      },
      setQingkong(state,action){
        state.fileList=[];
        state.editorData="";   //富文本
        state.tags=[];  //标签
        state.problemBzObj={};
        state.problemList=[];//问题列表
        state.problemIds=[];
        state.kb_title="";
        state.kb_id="";
        state.tree_id="";
        state.problemSenWord=[];
        state.contentSenWord=[];  
        return {...state};

      },
      setSensitiveWordsForProblem(state,action){
        state.problemSenWord=action.payload;
        return {...state}; 
      },
      setSensitiveWordsForContent(state,action){
        state.contentSenWord=action.payload;
        return {...state}; 
      },
      setTags(state,action){
        state.tags=action.payload;
        return {...state};
      },
      setFileList(state,action){
         state.fileList=action.payload;
         return {...state}; 
      },
      setContent(state,action){
         state.editorData=action.payload;
         return {...state}; 
      },
      setTagsAndEditorData(state,action){
        state.tags=action.payload.tags;
        state.editorData=action.payload.editorData;
        return {...state};
      },
      setProblemList(state,action){
        // state.problemList=action.payload.problemList;

        let problemIds=[];
        let problems=[];
        const question_info=action.payload.problemList;
        for(let i=0;i<question_info.length;i++){
          if(question_info[i].quest_type===1 || question_info[i].quest_type==='1'){
            state.problemBzObj=question_info[i];
          }else{
            problems.push(question_info[i]);
            problemIds.push(question_info[i].quest_id)
          }
        }
        state.problemList=problems; 
        state.problemIds=problemIds;


        state.kb_title=action.payload.kb_title;
        return {...state};
      }
  },

  effects: {
      *query(action, { call, put, select }) {
        // console.log("query--------------------",action.payload);
        const kb_id=action.payload;
        const result = yield call(getKnowledgeInfoByKbid,{kb_id:action.payload});
        // console.log("query result==>",result);
        yield put({ type: 'setStateList', payload: result.data});
      },
      *saveKnowledge(action, { call, put, select }) {
          // console.log("*********saveKnowledge",action.payload);
          const addParams=action.payload;
          //问题敏感词判断
          let problemContent="";
          for(let i=0;i<addParams.question_info.length;i++){
              problemContent=problemContent+addParams.question_info[i].quest_desc+",";
          }
          const proresult = yield call(getKbSensitiveWords,{content:problemContent});
          // console.log("proresult==>",proresult);          
          if(proresult.data.length>0){
            yield put({ type: 'setSensitiveWordsForProblem', payload: proresult.data});
              message.info('问题有敏感词，请修改!');
              return;
          }

          const contentresult = yield call(getKbSensitiveWords,{content:addParams.main_info[0].kb_content});         
          if(contentresult.data.length>0){
             yield put({ type: 'setSensitiveWordsForContent', payload: contentresult.data});
              message.info('内容有敏感词，请修改!');
              return;
          }
          const stateData = yield select(({graphicKnowledgeModel})=>({graphicKnowledgeModel}));
          if(stateData.graphicKnowledgeModel.tags.length===0){ //添加标签
            action.knowledgeLabelModal.showModal();
            return;
          }
          
          const result = yield call(saveKnowledge,addParams);
          // console.log("保存图文知识:",result)
          if(result.data==='saveOk'){
            hashHistory.push("/knowledgeBase/index/list");
          }else{
            message.info('保存图文知识失败，请联系管理员!');
          }           
      }
      ,
      *updateKnowledge(action, { call, put, select }) {
          const addParams=action.payload;
            //问题敏感词判断
            let problemContent="";
            for(let i=0;i<addParams.question_info.length;i++){
                problemContent=problemContent+addParams.question_info[i].quest_desc+",";
            }
            const proresult = yield call(getKbSensitiveWords,{content:problemContent});
            // console.log("proresult==>",proresult);
            
            if(proresult.data.length>0){
                yield put({ type: 'setSensitiveWordsForProblem', payload: proresult.data});
                message.info('问题有敏感词，请修改!');
                return;
            }

            const contentresult = yield call(getKbSensitiveWords,{content:addParams.main_info[0].kb_content});
            if(contentresult.data.length>0){
               yield put({ type: 'setSensitiveWordsForContent', payload: contentresult.data});
                message.info('内容有敏感词，请修改!');
                return;
            }
            const stateData = yield select(({graphicKnowledgeModel})=>({graphicKnowledgeModel}));
            // console.log("update stateData----",stateData);

            if(stateData.graphicKnowledgeModel.tags.length===0){ //添加标签
              action.knowledgeLabelModal.showModal();
              return;
            }
            
            const result = yield call(updateKnowledge,addParams);
            //console.log("修改图文知识:",result)
            if(result.data==='update Ok'){
              hashHistory.push("/knowledgeBase/index/list");
            }else{
              message.info('修改图文知识失败，请联系管理员!');
            }
            
      }
      ,*updateLabel(action, { call, put, select }) {
        yield put({ type: 'setTagsAndEditorData', payload: action.payload});
        action.knowledgeLabelModal.showModal();
      }
      ,*getTreeId(action, { call, put, select }) {
        yield put({ type: 'setTreeId', payload: action.payload});
      }
      ,*qingkong(action, { call, put, select }) {
        yield put({ type: 'setQingkong', payload: action.payload});
      }
      ,*checkSensitiveWordsForProblem(action, { call, put, select }) {        
          const result = yield call(getKbSensitiveWords,action.payload);
          // console.log("checkSensitiveWordsForProblem==>",result);
          yield put({ type: 'setSensitiveWordsForProblem', payload: result.data});
      }
      ,*checkSensitiveWordsForContent(action, { call, put, select }) {        
        const result = yield call(getKbSensitiveWords,action.payload);
        yield put({ type: 'setSensitiveWordsForContent', payload: result.data});
      }

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {const path=location.pathname;
        const params=path.split("/");
        const kb_id=params[3];
        if (params[2] === 'KnowledgeGraphickRoute' || params[2] === 'KnowledgeGraphickViewRoute') {
          if(kb_id!=='0'){  //根据id查询详情
            dispatch({
              type: 'query',
              payload: kb_id,
            })
          }else{ //新增,需清空
            dispatch({
              type: 'qingkong',
              payload: {},
            })
          }
        }
      })
    },
  }

};
