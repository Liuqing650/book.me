import React from 'react';
import { Timeline, Icon } from 'antd';
import 'braft-editor/dist/braft.css';
import styles from './index.less';

const Book = ({
  isEdit,
  htmlContent,
  lineData,
  onChangeValue
}) => {
  const onAddItem = () => {
    onChangeValue({isEdit: !isEdit});
  };
  const createLineContent = (itemData) => {
    return (
      <div>
        <h3>{itemData.time}</h3>
        <div dangerouslySetInnerHTML={{__html: itemData.content}} />
        {/* <div>{itemData.content}</div> */}
      </div>
    );
  };
  const createTimeLine = (data) => data.map((item, index) => {
    const color=item.status === 1 ? 'green': 'blue';
    return <Timeline.Item key={index} color={color}>{createLineContent(item)}</Timeline.Item>;
  });

  return (
    <div>
      <Timeline pending={<a className={styles.addItem} onClick={onAddItem}>新增计划</a>}>
        {createTimeLine(lineData)}
      </Timeline>
    </div>
  );
};

Book.propTypes = {
};

export default Book;
