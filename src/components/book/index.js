import React from 'react';
import { Divider, Timeline, Icon, Row, Col } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import MyEditor from '../edit';
import styles from './index.less';
moment.locale('zh-cn');
const Book = ({
  book,
  lineData,
  onChangeValue,
  onFinish,
  onModify,
  onUpdate,
  onDelete,
  viewContent
}) => {
  const cssName = `${book.isEdit ? styles.showTag : styles.hideTag}`;
  const cssStyle = {
    background: '#fff',
    padding: 24,
    height: book.isEdit ? 350 : 'auto',
    overflow: 'auto'
  };
  const onAddItem = () => {
    book.isEdit = !book.isEdit;
    book.isUpdate = false;
    book.content = null;
    onChangeValue({book});
  };
  const onEditItem = () => {
    book.isEdit = !book.isEdit;
    onChangeValue(book);
  };
  const onSubmit = () => {
    const { isUpdate } = book;
    const obj = {
      time: moment().format('YYYY-MM-DD'),
      content: book.content,
      status: 1,
    };
    viewContent(obj);
  };
  const toolConfig = [
    {
      handle: onEditItem,
      content: <Icon type={book.isEdit ? 'caret-down' : 'caret-up'} />,
      show: true
    }, {
      handle: onSubmit,
      content: '提交数据',
      show: book.isEdit
    }, {
      handle: onSubmit,
      content: '预览效果',
      show: book.isEdit
    },
  ];
  const timeLineConfig = [
    {
      handle: onFinish,
      content: '完成',
    },
    {
      handle: onModify,
      content: '修改',
    },
    {
      handle: onDelete,
      content: '删除',
    },
  ];
  const createLineTool = (data, itemData, index) => {
    const output = [];
    data.map((item, index) => {
      output.push(
        <span key={index}>
          {index > 0 ? <Divider type="vertical" /> : null}
          <a onClick={() => item.handle(itemData, index)}>{item.content}</a>
        </span>
      );
    });
    return output;
  };
  const createLineContent = (itemData, index) => {
    return (
      <div>
        <Row>
          <Col span={2}>
            <h3>{itemData.time}</h3>
          </Col>
          <Col span={5}>
            {createLineTool(timeLineConfig, itemData, index)}
          </Col>
        </Row>
        <div className={`ql-container ql-snow`} style={{ border: 'none'}}>
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: itemData.content }} />
        </div>
      </div>
    );
  };
  const createTimeLine = (data) => {
    const output = [];
    data.map((item, index) => {
      const color = item.status === 1 ? 'green' : 'blue';
      output.push(<Timeline.Item key={index} color={color}>{createLineContent(item, index)}</Timeline.Item>);
    });
    return output;
  };
  const createTool = (data) => {
    const output = [];
    data.map((item, index) => {
      if (item.show) {
        output.push(<div key={index} className={styles.btn} onClick={item.handle}>{item.content}</div>);
      }
    })
    return output;
  };
  const editorProps = {
    content: book.content,
    onChange(data) {
      book.content = data;
      onChangeValue({book})
    }
  };
  return (
    <div>
      <div style={cssStyle}>
        <Timeline pending={<a className={styles.addItem} onClick={onAddItem}>新增计划</a>}>
          {createTimeLine(lineData)}
        </Timeline>
      </div>
      <div className={cssName}>
        <div className={`clearfix ${styles.tool}`}>
          {createTool(toolConfig)}
        </div>
        <div className={book.isEdit ? styles.editContent : null}>
          {book.isEdit ? <MyEditor {...editorProps} />  : null}
        </div>
      </div>
    </div>
  );
};
Book.propTypes = {
};
export default Book;
