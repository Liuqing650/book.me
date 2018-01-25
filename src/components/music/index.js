import React from 'react';
import mockData from '../../utils/mock';
import styles from './index.less';
const ListCom = () => {
  const createList = () => {
    const output = [];
    mockData.map((item, index) => {
      output.push(
        <div key={index}>{item.value}</div>
      );
    });
    return output;
  };
  return (
    <div className={styles.wrap}>
      {createList()}
    </div>
  );
};
export default ListCom;
