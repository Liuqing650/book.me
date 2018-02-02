import React, { PropTypes } from 'react'
import {
    Row, Col, Select, Tabs, Form, Input, Button, message, Table, Layout, Menu, Tree, Breadcrumb, Icon
    , Spin, Radio
} from 'antd';

import IndexLeft from '../../components/knowledgeBase/knowledgeManger/IndexLeft'
import IndexRight from '../../components/knowledgeBase/knowledgeManger/IndexRight'
import styles from '../../components/knowledgeBase/knowledgeManger/styles.less'
import KbUtil from '../../components/knowledgeBase/knowledgeManger/KbUtil'



/**
 * 新知识管理入口，2017-9-18
 */
export default class KnowledgeBaseRoute extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * selectedKeys:array<string>, e:{selected: bool, selectedNodes, node, event}
     * @param {*} selectedKeys 
     * @param {*} e 
     */
    onTreeSelect(selectedKeys, e){
        console.log("selectedKeys",selectedKeys);
        this.right.onTreeSelect(selectedKeys, e);
    }
    exportDir(tree_id){
        this.right.exportDir(tree_id);
    }
  
    render() {
        //this.props.params.name
        console.log("this.props.params.name",this.props.params.name);
       
      
        const rightProps={
            isAppove:"approve"==this.props.params.name
           
        }

        const treeProps={
            onTreeSelect:this.onTreeSelect.bind(this),
            rightMenu:true,
            isAppove:rightProps.isAppove,
            exportDir:this.exportDir.bind(this),
        };
        const height=KbUtil.getPaneHeight();
        //console.log("height",height);
        return (

            <Row style={{height:height+"px"}} className={styles.kbMain}>
                <Col span={5} className={styles.leftPart}>
                    <IndexLeft ref={(ref) => { this.left = ref; }}   {...treeProps} />
                </Col>
                <Col className={styles.rightPart} span={19}>
                   

                    <IndexRight {...rightProps} ref={(ref) => { this.right = ref; }} />
                </Col>
            </Row>

        );
    }
}