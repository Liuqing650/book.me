import React from 'react';
import Chart from './chart';
import styles from './index.less';
const User = ({
  baseData
}) => {
  const chartProps = {
    data: baseData,
    height: 600,
    layoutCfg: {
      direction: "V",
      getHGap: () => {
          return 50;
      },
      getVGap: () => {
          return 80;
      }
    },
    grid: null,
    // grid: {
    //   forceAlign: true, // 是否支持网格对齐
    //   cell: 0,         // 网格大小
    // },
   // behaviourFilter: ['wheelZoom'], // 过滤(禁用)鼠标滚轮缩放行为
    saveData(data) {
      console.log('data------>', data);
    }
  };
  return (
    <div className={styles.warp}>
      <Chart {...chartProps} />
    </div>
  );
};

User.propTypes = {
};

export default User;
