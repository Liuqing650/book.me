import React from 'react';
import Chart from './chart';
import Mock from 'mockjs';
import styles from './index.less';
console.log('Mock---->', Mock);
const Random = Mock.Random;
const User = ({
  baseData,
  dataLength
}) => {
  const chartProps = {
    data: baseData,
    dataLength: dataLength,
    width: 800,
    height: 600,
    fitViewPadding: 30,
    layoutCfg: {
      direction: "V",
      getHGap: () => {
        return 35;
      },
      getVGap: () => {
        let height = 80;
        if (dataLength > 80) {
          height = dataLength * 2;
        }
        return height;
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


  const data = Mock.mock({
    'data|200-300': [
      {
        'id|+1': 1,
        'name': '@cname',
        'email': `@email('qq.com')`,
        'address': '@city',
        'avator': `@image('80x80', '#ffcc33', '#FFF', 'png', '@first')`
      }
    ]
  })
  console.log('mockData----->', data);
  return (
    <div className={styles.warp}>
      <Chart {...chartProps} />
    </div>
  );
};

User.propTypes = {
};

export default User;
