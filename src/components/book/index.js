import React from 'react';
import { Timeline, Icon } from 'antd';
import styles from './index.less';

const Book = ({
  isEdit,
  onChangeValue
}) => {
  const lineData = [
    {time:'2017-12-5',content:'哈哈', status: 0},
    {time:'2017-12-8',content:'哈哈', status: 1},
    {time:'2017-12-9',content:'哈哈', status: 0},
  ];
  const onAddItem = () => {
    onChangeValue({isEdit: !isEdit});
  };
  const createLineContent = (itemData) => {
    return (
      <div>
        <h3>{itemData.time}</h3>
        <div>{itemData.content}</div>
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
