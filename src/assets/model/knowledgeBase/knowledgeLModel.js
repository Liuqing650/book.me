import React from 'react';
import {message} from 'antd';
import TreeUtil from '../../utils/treeUtil';
import {getTreeData,getTagsByWords,getKeyWords,getKnowledgeIndexByName} from '../../services/knowledgeBase/graphicKnowledge/graphicLabelService';
export default {
  namespace:'knowledgeLModel',
    state:{
        //树
        filterDropdownVisible: false,
        filtered: false,
        setTagData:[],
        getTreeData:[],
        treeNode:null,
        getTreeSonData:[],
        children:[],
        checkedKeys:[],
        Default:['JVN9jxlM'],
        //表格
        getTableTags:[],
        //新建标签页面
        getNewWords:[],
        tagSelectedAll:[],
        getSearchData:[],
        judgeLastTrue:false,
        expandedKeys:['00'],
        indeterminate:false,
        checkAll:false,
        defaultNewData:[],
    },
    subscriptions:{
        setup({ dispatch, history }) {
            history.listen(location => {
                const path=location.pathname;
                console.log(path);        
                const params=path.split("/");
                console.log(params);
                const kb_id=params[3];
                if (params[2] === 'KnowledgeGraphickRoute') {
                        //dispatch({ type: 'query',payload: location.query})
                }
             })
        },
    },
    effects:{
        *query({ payload }, { call, put }){
            let obj = {"parent_id":"-1"};
            const data = yield call(getTreeData,obj);
            if(data){
                yield put({type:"clearSelectedAll"})
                yield put({
                    type:'getTreeData',
                    payload:{
                        payload:data
                    }
                })
            }      
        },
        //树的子节点查询方法
        *sonTagData({ payload }, { call, put }){
            //console.log("sonTagData payload---->",payload)
            let node = payload.node;
            let parent_id = payload.parent_id;
            let obj = {};
            obj['parent_id'] = payload.parent_id;
           const data = yield call(getTreeData,obj)
            if(data){
               // console.log("data---->",data)
                yield put({
                    type:'getTreeSonData',
                    payload:{
                        payload:{
                            data:data,
                            node:node,
                            parent_id:parent_id,
                        }
                    }
                })
            }
        },
        //表格的列表查询方法：
        *getTagsByWords({ payload }, { call, put }){
            //console.log("表格的列表查询方法：getTagsByWords====>",payload);
                const tags=payload.tags;
                let obj = {"type":"n","kb_title":payload.kb_title,"kb_content":payload.kb_content}
                //console.log("表格的列表查询方法：obj====>",obj);
                const data = yield call(getTagsByWords,obj)
                //console.log("表格的列表查询方法：data====>",data);
                if(data){
                    yield put ({
                        type:'setTagsByWords',
                        payload:{data:data.data,tags:tags}
                    })
                }
        },
        //新增标签：
        *getKeyWords({ payload }, { call, put }){
            if(payload.kb_title!='' && payload.kb_title!=null){
                let obj = {"keynums":"50","minscore":"1","kb_title":payload.kb_title,"kb_content":payload.kb_content}
                const data = yield call(getKeyWords,obj)
                if(data){
                    yield put ({
                        type:'setKeyWords',
                        payload:data.data
                    })
                }
            }
        },
        //树的搜索
        *treeSearch({ payload }, { call, put }){
            let obj = {"cls_name":payload}
            const data = yield call(getKnowledgeIndexByName,obj)
            if(data){
                yield put ({
                    type:"getSearchData",
                    payload:data
                })
            }
        },
        //判断显示树还是显示表格
        *judegTree({ payload }, { call, put }){
            let judgeLast;
            if(payload){
                let obj = {"cls_name":payload}
                const data = yield call(getKnowledgeIndexByName,obj)
                if(data){
                    yield put ({
                        type:"getSearchData",
                        payload:data
                    })
                }
                yield put ({
                    type:"judgeLastTrue",
                    payload:true
                })
            }else{
                console.log("出来吧null，judgeLast",false)
                    yield put ({
                        type:"judgeLastTrue",
                        payload:false
                    })
            }
            
            
        },
    },
    reducers:{
        judgeLastTrue(state,action){
            state.judgeLastTrue = action.payload;
            return {...state};
        },
        filterSearch(state,action) {
            return {...state,...action.payload};
        },
        setSearchInput(state,action) {
            state.searchText = action.payload;
            return {...state};
        },
        setTagData(state,action){
            //console.log("setTagData",action.payload)
            const tagSelected = [];
            action.payload.map((item)=>{
                let obj = {type:1,id:item.props.dataRef.cls_id,name:item.props.dataRef.cls_name}
                tagSelected.push(obj);
            })
            state.tagSelected = tagSelected;
            return{...state};
        },
        setTagData2(state,action){
            const tagSelected2 = [];
            action.payload.map((item)=>{
                let obj = {type:2,id:"",name:item}
                tagSelected2.push(obj);
            })
            //console.log("tagSelected2---->",tagSelected2)
            state.tagSelected2 = tagSelected2;
            return{...state};
        },
        setTagDataTable(state,action){
            const setTagDataTable = [];
            action.payload.map((item)=>{
                let obj = {type:1,id:item.cls_id,name:item.cls_name}
                setTagDataTable.push(obj);
            })
            state.tagSelectedTable = setTagDataTable
            return{...state};
        },
        getTreeData(state,action){
            state.getTreeData = action.payload.payload;

            //console.log('getTreeData---->',action.payload.payload)
            return{...state};
        },
        getTreeSonData(state,action){
            let payload = action.payload.payload
            state.getTreeSonData = action.payload.payload.data
            return{...state};
        },
        setTagsByWords(state,action){
            state.getTableTags = action.payload.data;
            state.tagSelectedAll=action.payload.tags;
            return{...state};
        },
        setKeyWords(state,action){
            let arr = [];
            action.payload&&action.payload.length>0?action.payload.map((item)=>{
                let tempObj = {};
                tempObj = item.name;
                if(item.name!=undefined){
                    arr.push(tempObj)
                }
            }):null
            state.getNewWords = arr;
            return{...state};
        },
        refresh(state,action){
            return{...state}
        },
        deleteData(state,action){            
            let tags = state.tagSelectedAll ;
            const tagsNew = tags.filter(tag => tag !== action.payload);
            state.tagSelectedAll=tagsNew;
            return{...state}
        },
        getSearchData(state,action){
            state.getSearchData = action.payload
            return{...state}
        }, 
        recommendTag(state,action){ //推荐标签  
            let selectedLabels=[]; 
            for(let i=0;i<state.tagSelectedAll.length;i++){
                 if(state.tagSelectedAll[i].type!=1){
                        selectedLabels.push(state.tagSelectedAll[i]);
                 }
            }    
            action.payload.map((item)=>{
                let obj = {type:1,id:item.cls_id,name:item.cls_name}
                selectedLabels.push(obj);
            })
            state.tagSelectedAll = selectedLabels
            return{...state}
        },newTag(state,action){ //新标签         
            let selectedLabels=[]; 
            for(let i=0;i<state.tagSelectedAll.length;i++){
                 if(state.tagSelectedAll[i].type!=2){
                        selectedLabels.push(state.tagSelectedAll[i]);
                 }
            }
            action.payload.map((item)=>{
                let obj = {type:2,id:"",name:item}
                selectedLabels.push(obj);
            })         
            let tais;
            console.log("action.payload",action.payload)
            if(action.payload.length>0){
                console.log("1111111")
                tais = true;
            } else{
                console.log("2222222")
                tais = false;
            }
            state.tagSelectedAll = selectedLabels
            state.indeterminate = tais
            
            return{...state}
        },
        treeTags(state,action){ //树标签
            let selectedLabels=[]; 
            for(let i=0;i<state.tagSelectedAll.length;i++){
                 if(state.tagSelectedAll[i].type!=3){
                        selectedLabels.push(state.tagSelectedAll[i]);
                 }
            }
            action.payload.map((item)=>{
                let obj = {type:3,id:item.props.dataRef.cls_id,name:item.props.dataRef.cls_name}
                selectedLabels.push(obj);
            })
            state.tagSelectedAll = selectedLabels
            return{...state}
        },
        searchTags(state,action){ //搜索标签
            let selectedLabels=[]; 
            for(let i=0;i<state.tagSelectedAll.length;i++){
                 if(state.tagSelectedAll[i].type!=3){
                        selectedLabels.push(state.tagSelectedAll[i]);
                 }
            }
            action.payload.map((item)=>{
                let obj = {type:3,id:item.cls_id,name:item.cls_name}
                selectedLabels.push(obj);
            })
            state.tagSelectedAll = selectedLabels
            return{...state}
        },
        onCheckAllChange(state,action){//新标签的全选功能
            let e = action.payload;
            state.checkAll = e.target.checked
            state.indeterminate = e.target.checked
            if (!e.target.checked) {
                let tempArr = [];
                state.tagSelectedAll.map((item,index)=>{
                    if(item.type!=2){
                        tempArr.push(item)
                    }
                })
                state.tagSelectedAll = tempArr
            }else{
                let selectedLabels=[]; 
                for(let i=0;i<state.tagSelectedAll.length;i++){
                     if(state.tagSelectedAll[i].type!=2){
                            selectedLabels.push(state.tagSelectedAll[i]);
                     }
                }
                state.getNewWords.map((item)=>{
                    let obj = {type:2,id:"",name:item}
                    selectedLabels.push(obj);
                })
                state.tagSelectedAll = selectedLabels
                
            }
            return{...state}
        }
    }
    }