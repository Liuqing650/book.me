import React, { PropTypes } from 'react';
import { Tag, Input, Tooltip, Button,Row,Col,Upload } from 'antd';
import KnowledgeContent from '../../components/knowledgeBase/common/KnowledgeContent';
import { connect } from 'dva';
import { hashHistory } from 'react-router';

import GraphicKnowledgeMain from '../../components/knowledgeBase/graphicKnowledge/GraphicKnowledgeMain';
import KnowledgeGraphickViewStyle from './KnowledgeGraphickViewStyle.less'

class KnowledgeSceneViewRoute extends React.Component{ 
    
    reBack(e){
        hashHistory.push("/knowledgeContent/sceneKnowledge?kb_id="+this.props.sceneKnowledgeMainModel.kb_id+"&isRead=true");
    }
    
	render(){          
        // console.log("~~~~~~~KnowledgeGraphickViewRoute~~~~~~~",this.props);
        const {editorData,tags,fileList,kb_path}=this.props.sceneKnowledgeMainModel;
        const content= <div
                dangerouslySetInnerHTML={{
                    __html: editorData
                }}>
            </div>        
        
        
		return(
			    <div style={{height:'90vh',background: '#fff'}}>

                 <div>
                    <div className={KnowledgeGraphickViewStyle.viewFont}>知识详情</div>
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
                        <Button type="primary" onClick={this.reBack.bind(this)} >返回场景树>></Button>
                </div>  

			</div>
	    )
	}
}

function mapStateToProps({
	'sceneKnowledgeMainModel':sceneKnowledgeMainModel
}) {
  return {sceneKnowledgeMainModel};
}

export default connect(mapStateToProps)(KnowledgeSceneViewRoute);
