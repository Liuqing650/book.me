import React, { PropTypes } from 'react';
import { Tag, Input, Tooltip, Button,Row,Col,Upload } from 'antd';
import KnowledgeContent from '../../components/knowledgeBase/common/KnowledgeContent';
import { connect } from 'dva';
import { hashHistory } from 'react-router';

import GraphicKnowledgeMain from '../../components/knowledgeBase/graphicKnowledge/GraphicKnowledgeMain';
import KnowledgeGraphickViewStyle from './KnowledgeGraphickViewStyle.less'

class KnowledgeGraphickViewRoute extends React.Component{ 
    
     reBack(e){
        hashHistory.push("/knowledgeBase/index/list");
    }
    
	render(){          
        // console.log("~~~~~~~KnowledgeGraphickViewRoute~~~~~~~",this.props);
        const {editorData,tags,problemBzObj,problemList,fileList,kb_path}=this.props.graphicKnowledgeModel;
        const content= <div
                dangerouslySetInnerHTML={{
                    __html: editorData
                }}>
            </div>        
        let proList=[];
        for(let i=0;i<problemList.length;i++){
            if(i===0){
                proList.push("相似问题:"+problemList[i].quest_desc);
            }else{
                proList.push("        "+problemList[i].quest_desc);
            }
        }
		return(
			    <div style={{height:'90vh',background: '#fff'}}>

                 <div>
                    <div className={KnowledgeGraphickViewStyle.viewFont}>知识详情</div>
                </div>

                <div className={KnowledgeGraphickViewStyle.viewDiv}>
                    <div className={KnowledgeGraphickViewStyle.viewFont}>知识路径</div>
                    <div style={{padding: '10px'}}>{kb_path}</div>
                </div>

                <div className={KnowledgeGraphickViewStyle.viewDiv}>
                    <div className={KnowledgeGraphickViewStyle.viewFont}>知识问题</div>
                    <div style={{padding: '10px'}}>标准问题: {problemBzObj.quest_desc}</div>
                    <div style={{padding: '10px'}}>{proList}</div>
                </div>
                
                <div className={KnowledgeGraphickViewStyle.viewDiv}>                    
                    <div className={KnowledgeGraphickViewStyle.viewFont}>                
                        知识标签
                    </div>
                    <div style={{padding: '10px'}}>
                        {tags.map((tag, index) => {
                        const isLongTag = tag.name.length > 20;
                        const tagElem = (
                            <Tag key={tag.name}>
                            {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
                            </Tag>
                        );
                        return isLongTag ? <Tooltip title={tag.name}>{tagElem}</Tooltip> : tagElem;
                        })} 
                    </div>
                </div>
                
                <div className={KnowledgeGraphickViewStyle.viewDiv}>
                    <div className={KnowledgeGraphickViewStyle.viewFont}>                
                        知识内容
                    </div>
                    <div style={{padding: '10px'}}>{content}</div>
                </div>

                 <div className={KnowledgeGraphickViewStyle.viewDiv} >
                        <div className={KnowledgeGraphickViewStyle.viewFont}>                
                            附件信息
                        </div>
                        <div style={{width:'300px'}}>
                            <Upload fileList={fileList}>
                            </Upload>
                        </div>
                </div>

                 <div style={{marginBottom:'20px',paddingTop:'10px'}}>
                        <Button type="primary" onClick={this.reBack.bind(this)} >返回列表>></Button>
                </div>  

			</div>
	    )
	}
}

function mapStateToProps({
	'graphicKnowledgeModel':graphicKnowledgeModel
}) {
  return {graphicKnowledgeModel};
}

export default connect(mapStateToProps)(KnowledgeGraphickViewRoute);
