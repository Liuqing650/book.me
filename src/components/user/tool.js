import React from 'react';
import {Icon} from 'antd';
import styles from './index.less';

const SideTool = ({
  scale,
  onClick,
}) => {
  const handleClick = (even) => {
    onClick(even);
  };
  return (
    <div className={styles.toolWrap}>
      <div className={`clearfix ${styles.box}`}>
        <div className={styles.zoomContent}>
          <p onClick={() => handleClick('add')}><Icon type="plus" /></p>
          <p className={styles.zoomText}>{`${scale}%`}</p>
          <p onClick={() => handleClick('sub')}><Icon type="minus" /></p>
        </div>
        <div className={styles.toolBtn} onClick={() => handleClick('download')}><Icon type="download" /></div>
      </div>
    </div>
  );
};
export default SideTool;
