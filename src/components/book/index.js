import React from 'react';
import 'react-quill/dist/quill.snow.css';
import { Timeline, Icon } from 'antd';
import styles from './index.less';
import Editor from '../edit';

const Book = ({
  isEdit,
  htmlContent,
  lineData,
  onChangeValue,
}) => {
  const onAddItem = () => {
    onChangeValue({ isEdit: !isEdit });
  };
  const onSubmit = () => {
  };
  const createLineContent = (itemData) => {
    return (
      <div>
        <h3>{ itemData.time }</h3>
        <div dangerouslySetInnerHTML={{ __html: itemData.content }} />
      </div>
    );
  };
  const createTimeLine = (data) => {
    data.map((item, index) => {
      const color = item.status === 1 ? 'green' : 'blue';
      return <Timeline.Item key={ index } color={ color }>{ createLineContent(item) }</Timeline.Item>;
    });
  };
  const cssName = `${isEdit ? styles.showTag : styles.hideTag}`;
  const toolConfig = [
    {
      handle: onAddItem,
      content: <Icon type={isEdit ? 'caret-down' : 'caret-up'} />,
    }, {
      handle: onSubmit,
      content: '提交数据',
    }, {
      handle: onSubmit,
      content: '预览效果',
    },
  ];
  return (
    <div>
      <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
        <Timeline pending={<a className={styles.addItem} onClick={onAddItem}>新增计划</a>}>
          {createTimeLine(lineData)}
        </Timeline>
      </div>
      <div className={cssName}>
        <div className={`clearfix ${styles.tool}`}>
          { toolConfig.map((item, index) => <div key={index} className={styles.btn} onClick={item.handle}>{item.content}</div>) }
        </div>
        <div className={isEdit ? styles.editContent : null}>
          {isEdit ? <Editor content={htmlContent} onChange={onChangeValue} />  : null}
        </div>
      </div>
    </div>
  );
};
Book.propTypes = {
};
export default Book;
