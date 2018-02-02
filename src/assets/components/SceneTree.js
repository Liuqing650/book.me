import React from 'react';
import { Form, Input, Button, Row, Col, } from 'antd';
import classNames from 'classnames';
import styles from '../sceneKnowledgeStyle.less';
import { hashHistory } from 'react-router';

import G6Component from './G6Component';

const FormItem = Form.Item;
const formItemLayout = {
    wrapperCol: {
        span: 23,
    },
};

const SceneTree =({
    loading,
    kbid,
    isRead,
    isAdd,
    isEditG6, // 用于判断是否进行图形编辑，需要先获取到kb_id才可以
    isEditKnowledge,
    onModelChange,
    toolSelected,
    treeData,
    seacrhG6Info,
    onSeacrhG6,
    onChangeTree,
    onAddItem,
    onAddRootItem,
    onUpdateItem,
    onSaveTree,
    onDelKbDialog,
    onSetKbid,
    onEditKnowledge,
    onFinshKnowledge,
    onCancelKnowledge,

    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
    }
}) => {

    function handleSubmit() {
        validateFields((errors) => {
            if(errors) {
                return
            }
            const data = { ...getFieldsValue()}
            data['isSearch'] = true;
            onSeacrhG6(data);
        })
    }

	const  G6ComponentProps = {
        loading,
        kbid,
        isRead,
		data: treeData,
		height: 600,    // 画布高
        showButton: isRead?false:true, // 是否显示添加按钮
        isEditKnowledge,
        layoutCfg: {
  			direction: "TB",
            getHGap: function() {
                return 20;
            },
            getVGap: function() {
                return 40;
            }
		},
        grid: {
		    forceAlign: true, // 是否支持网格对齐
		    cell: 10,         // 网格大小
		},
        behaviourFilter: ['wheelZoom'], // 过滤鼠标滚轮缩放行为
        isShowToolHealp:isRead?false:true,
        toolDefault : {value:'edit'}, //默认选中模式{value:'edit/add/delete/save'}
        configTool:[{value:'edit',isUse:true},{value:'update',isUse:true},{value:'add',isUse:true},{value:'delete',isUse:true},{value:'save',isUse:true}], //工具栏配置信息{value:'edit/add/delete/save',isUse:false|true}
        toolSelected : toolSelected, // 选中模式
        onModelChange,  // 模式改变
        search:seacrhG6Info,  // 搜索数据信息{isSearch: true|false , search: 搜索文字}
        onSeacrhG6, // 回调修改搜索状态{isSearch: true|false}

        // 编辑模式执行方法模块
        onEditKnowledge,
        onFinshKnowledge,
        onCancelKnowledge,

        onEditNode(payload) {
            let isAdd = payload.isAdd;
            let data = payload.data;
            // console.log("isAdd---------->",isAdd);
            if(isAdd) {
                onAddItem(data)  // 新增单个节点
            } else {
                onUpdateItem(data) // 修改单个节点
            }
        },
        saveData(data) {    // 树形图数据（需要激活保存数据按钮）
          // console.log("树形图数据-------------->",data);
          onSaveTree(data);
        },
        onAddModalData(data) { // 添加节点数据(主要为root节点)
            onSetKbid(data.kb_id);
            onAddRootItem(data);
        },
        onDelKbDialog, // 删除节点
	}


    const classes = classNames({
        [styles.showMark]: kbid==null?true:false,
        [styles.hideMark]: kbid==null?false:true,
    });
    const height = document.documentElement.clientHeight-270;
	return (
		<div className={styles.SceneTree}>
			<Row>
                <Form>
                    <Col span={6}>
                        <FormItem
                          {...formItemLayout}
                        >
                          {getFieldDecorator('search', {
                            rules: [ {
                              max: 100, message: '请注意，最长不能超过100字!',
                            }],
                          })(
                            <Input placeholder="请填写节点内容" />
                          )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <Button type="dashed" onClick={handleSubmit} size="large" icon="search">搜索节点</Button>
                    </Col>
                </Form>
            </Row>
            <div className={styles.treeWrapper}>
                <div className={classes} style={{height:height}}>
                    <div className={styles.messageStyle}>请先完善场景名称</div>
                </div>
                <div style={{height:height}}>
                    <G6Component {...G6ComponentProps} />
                </div>

            </div>
		</div>
	)
}


export default Form.create()(SceneTree);
