import React from 'react';
import { connect} from 'dva';
import KnowledgeLabel from '../../components/knowledgeBase/common/KnowledgeLabel'              
import KnowledgeCheckLabel from '../../components/knowledgeBase/common/KnowledgeCheckLabel'
import KnowlegeReadTag from '../../components/knowledgeBase/common/KnowlegeReadTag'
import KnowledgeNewTag from '../../components/knowledgeBase/common/KnowledgeNewTag'


class KnowledgeLabelPage extends React.Component{
    componentDidMount = () => {
        //console.log("0000 componentDidMount------------");
        if(this.props.kb_content!=''){
            this.props.dispatch({
                    type:'knowledgeLModel/getTagsByWords',
                    payload:{kb_title:this.props.kb_content,kb_content:this.props.kb_content,tags:this.props.tags}
                })
            this.props.dispatch({ 
                    type:'knowledgeLModel/getKeyWords',
                    payload:{kb_title:this.props.kb_content,kb_content:this.props.kb_content,tags:this.props.tags}
                })

            this.props.dispatch({ 
                    type:'knowledgeLModel/query',
                    payload:{}
                })
        }
    }

    componentWillReceiveProps(nextProps){ 
        //console.log("111 nextProps:",nextProps);
        //console.log("222 thisProps:",this.props);
        if(JSON.stringify(nextProps.kb_content)!==JSON.stringify(this.props.kb_content)
			||
            JSON.stringify(nextProps.tags)!==JSON.stringify(this.props.tags))
        {
            if(nextProps.kb_content!=''){
                nextProps.dispatch({
                        type:'knowledgeLModel/getTagsByWords',
                        payload:{kb_title:nextProps.kb_content,kb_content:nextProps.kb_content,tags:nextProps.tags}
                    })
                nextProps.dispatch({ 
                        type:'knowledgeLModel/getKeyWords',
                        payload:{kb_title:nextProps.kb_content,kb_content:nextProps.kb_content,tags:nextProps.tags}
                    })
                
                nextProps.dispatch({ 
                    type:'knowledgeLModel/query',
                    payload:{}
                })
            }
        }

    }


    render(){
    //console.log("KnowledgeLabelPage===>",this.props);
    const kb_content=this.props.kb_content;
    //console.log("tags---===--==--==>>>",this.props.tags)
    const {
        //树
        treeNode,getTreeData,getTreeSonData,
        filterDropdownVisible,filtered,setTagData,
        checkedKeys,treeSearch,Default,checkStrictly,
        getSearchData,expandedKeys,
        //表格
        getTableTags,
        //新增标签
        getNewWords,indeterminate,setTagData2,checkAll,defaultNewData,
        //已选标签
        tagSelected,
        tagSelected2,    
        tagSelectedTable, 
        tagSelectedAll,
        judgeLastTrue
    } = this.props.knowledgeLModel
    const self=this;
    //表格~
    const KnowledgeCheckLabelProps={
        filterDropdownVisible:filterDropdownVisible,
        kb_content:this.props.kb_content,
        filtered:filtered,
        getTableTags:getTableTags,
        checkStrictly:checkStrictly,
        tagSelectedAll:tagSelectedAll,
        getCheckboxProps: function (value) {
            return {
            defaultChecked: value.cls_id === '0jW3BU2n', // 配置默认勾选的列
            }
        },
        handleSearch(data) {
            self.props.dispatch({
                type:"knowledgeLModel/filterSearch",
                payload:data
            })
        },
        onInputChange(e) {
            self.props.dispatch({
                type:"knowledgeLModel/setSearchInput",
                payload:e.target.value
            })
        },
        rowSelectionf(selectedRow){ //1、推荐标签
            //console.log("selectedRows---->",selectedRows)
            /*self.props.dispatch({
                type:"knowledgeLModel/setTagDataTable",
                payload:selectedRows
            })*/
            self.props.dispatch({
                type:"knowledgeLModel/recommendTag",
                payload:selectedRow
            })
        }
        /*getTagsByWords(){
            dispatch({
                type:'knowledgeLModel/getTagsByWords',
                payload:{
                    kb_title:this.props.kb_content,
                    kb_content:this.props.kb_content
                }
            })
        }*/

    }
    //树
    const treeTag = []
    this.props.tags.map((item)=>{
        if(item.type==3){
            treeTag.push(item.id)
        }
    })
    //console.log("treeTag------>>",treeTag)
    const KnowledgeLabelProps ={        
        getTreeData:getTreeData,
        getTreeSonData:getTreeSonData,
        checkedKeys:checkedKeys,
        treeTag:treeTag,
        tagSelectedAll:tagSelectedAll,
        getSearchData:getSearchData,
        judgeLastTrue:judgeLastTrue,
        expandedKeys:expandedKeys,
        onCheck(checkedKeys,e){
            self.props.dispatch({
                type:'knowledgeLModel/treeTags',
                payload:e.checkedNodes
            })
        },
        choseSearchTags(e){
            self.props.dispatch({
                type:'knowledgeLModel/treeTags',
                payload:e
            })
        },
        refresh(){
            self.props.dispatch({
                type:'knowledgeLModel/refresh'
            })
        },
        loadDataChild(node){
                const getTreeDataL= getTreeData.map((item)=>{
                    if(node.props.title== item.cls_name){
                        self.props.dispatch({
                            type:'knowledgeLModel/sonTagData',
                            payload:{
                                item:item,
                                parent_id:item.cls_id,
                                node:node,
                                eventKey:node.props.eventKey
                            }
                        })
                    }
                })
            // }
        },
        treeSearch(value){
            self.props.dispatch({
                type:'knowledgeLModel/treeSearch',
                payload:value
            })
        },
        judegTree(e){
            self.props.dispatch({
                type:'knowledgeLModel/judegTree',
                payload:e.target.value
            })
        },
        rowSreachionf(selectedRows){
            self.props.dispatch({
                type:'knowledgeLModel/searchTags',
                payload:selectedRows
            })
        }
    }
    //新增标签
    const KnowledgeNewTagProps= {
        getNewWords:getNewWords,
        indeterminate:indeterminate,
        checkAll:checkAll,
        tagSelected:tagSelected,
        tagSelectedAll:tagSelectedAll,
        defaultNewData:defaultNewData,
        getKeyWords(){
            self.props.dispatch({
                type:'knowledgeLModel/getKeyWords',
                payload:{
                    kb_title:kb_content,
                    kb_content:kb_content
                }
            })
        },
        getNewTags(e){
            self.props.dispatch({
                type:'knowledgeLModel/newTag',
                payload:e
            })
        },
        onCheckAllChange(e){
            self.props.dispatch({
                type:'knowledgeLModel/onCheckAllChange',
                payload:e
            })
        }
    }
    //已选标签
    const KnowlegeReadTagProps={
        tagSelected:tagSelected,
        tagSelected2:tagSelected2,
        tagSelectedTable:tagSelectedTable,
        setLabel:this.props.setLabel,
        onCancel:this.props.onCancel,
        tags:this.props.tags,
        tagSelectedAll:tagSelectedAll,
        refresh(){
            self.props.dispatch({
                type:'knowledgeLModel/refresh'
            })
        },
        deleteData(tagSelectItem){
            self.props.dispatch({
                type:'knowledgeLModel/deleteData',
                payload:tagSelectItem
            })
        }
    }
        return(
            <div style={{height:'80vh',overflow:'auto'}}>
                <div style={{marginBottom:"10px"}}>系统已根据录入内容推荐了相应标签，您也可以自主添加标签</div>
                <KnowledgeCheckLabel {...KnowledgeCheckLabelProps}/>
                <KnowledgeLabel {...KnowledgeLabelProps} />
                <KnowledgeNewTag {...KnowledgeNewTagProps} />
                <KnowlegeReadTag {...KnowlegeReadTagProps}/>
            </div>
        )
     }
}
function mapStateToProps({
	'knowledgeLModel':knowledgeLModel
}) {
  return {knowledgeLModel};
}
export default connect(mapStateToProps)(KnowledgeLabelPage);
