import React from 'react';
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
          <p onClick={() => handleClick('add')}><i className="fa fa-plus"></i></p>
          <p className={styles.zoomText}>{`${scale}%`}</p>
          <p onClick={() => handleClick('sub')}><i className="fa fa-minus"></i></p>
        </div>
        <div className={styles.toolBtn} onClick={() => handleClick('download')}><i className={styles.downloadIcon}></i></div>
      </div>
    </div>
  );
};
export default SideTool;




import React from 'react';
import TreeChart from './tree';

const Chart = ({
  chartData,
  dataLength
}) => {
  const treeChartProps = {
    data: chartData,
    dataLength: dataLength,
    height: 600,
    fitViewPadding: 30,
    layoutCfg: {
      direction: 'V',
      getHGap: () => {
        return 50;
      },
      getVGap: () => {
        return 80;
      }
    },
    grid: null
  };
  return (
    <div>
      {dataLength > 0 ? <TreeChart {...treeChartProps} /> : null}
    </div>
  );
};
export default Chart;











  // 数据总长度，用于下载图形时计算放大比例
  @observable dataLength = 0;
  @observable iserror = false;
  @action.bound structureMapping(data) {
    this.baseData = {};
    const mapInfo = {
      companyName: data.companyName ? data.companyName : '--', // 企业名称
      frname: data.frName ? `${data.frName}(法人代表)` : '--', // 华人代表
      entinvList: data.entinvItemList && data.entinvItemList.length > 0 ? data.entinvItemList : false, // 企业对外投资
      shareList: data.shareHolderList && data.shareHolderList.length > 0 ? data.shareHolderList : false, // 股东
      frinvList: data.frinvList && data.frinvList.length > 0 ? data.frinvList : false, // 法人对外投资
      frPositionList: data.frPositionList && data.frPositionList.length > 0 ? data.frPositionList : false, // 法人在外任职
    };
    const frInfo = {
      treename: mapInfo.frname,
      color: '#E5E5E5',
      dataType: 2, // 数据类型： 公司为1， 人名为2
      children: []
    };
    const config = {
      'date': '出资日期',
      'invest': '投资',
      'ratio': '占比',
    };
    // 获取label数据
    const handleLabel = (itemData, isFr = false) => {
      const output = {};
      const temp = {};
      output.isFr = isFr;
      output.line = isFr ? 1 : 2;
      if (isFr) {
        output.text = '担任法人';
        return output;
      }
      const modifyNumber = (value, unit = '万元') => {
        return isNaN(Number(value)) || Number(value).toFixed(2) === '0.00' ? '--' : Number(value).toFixed(2) + unit;
      };
      temp.date = itemData.conDate ? itemData.conDate : '--';
      temp.invest = itemData.subConam ? modifyNumber(itemData.subConam) : '--';
      temp.ratio = itemData.fundedRatio ? itemData.fundedRatio : '--';
      output.text = `${config.invest}${temp.invest}(${config.ratio}: ${temp.ratio})\n${config.date}: ${temp.date}`;
      return output;
    };
    /**
     * 检验公司名称
     * @param {*String} query 待测字符串
     * @param {*Number} minLen 最小长度
     * @return true | false
     */
    const checkCompanyName = (query, minLen = 6) => {
      if (!query) {
        return false;
      }
      const length = `${query}`.length;
      const cond0 = Boolean(length < minLen); // 字符串长度 < minLen
      const cond1 = !Boolean(/[^a-zA-Z]/.test(query)); // 全英文
      const cond2 = Boolean(`${query.replace(/[^0-9]+/g, '')}`.length >= length * 0.6); // 数字占比 >= 0.6;
      const cond3 = Boolean(/[~!@#$%\^&\*\-_=+<>,;:、。?/\\|～＠＃￥％＾＆＊＿＝＋＜＞，．。；：？／＼｜]/.test(query)); // 包含特殊字符
      const cond4 = Boolean(query.match(/[\(（]?\d{1,2}[\.\)）\u2E80-\u9FFF\s]/)); // 数字在前面的错误情况
      const cond5 = Boolean(query.match(/[\u2E80-\u9FFF]+[\da-zA-Z]?[\d]$/)); // 数字在最后的错误情况
      return !(cond0 || cond1 || cond2 || cond3 || cond4 || cond5);
    };

    // 获取股东数据
    const getShareData = (arrData, keys, dataType = 1) => {
      arrData.map((item) => {
        let type = dataType;
        if (dataType === 2 && checkCompanyName(item[keys])) {
          --type;
        }
        item.treename = item[keys];
        item.treeInfo = handleLabel(item);
        item.treeKey = keys;
        item.color = '#FFFFFF';
        item.dataType = type;
        this.baseData.children.push(item);
      });
    };
    // 获取法人信息
    const modifyFrData = (arrData, keys, isFr, dataType = 1) => {
      arrData.map((item) => {
        item.treename = item[keys];
        item.treeInfo = handleLabel(item, isFr);
        item.treeKey = keys;
        item.color = '#FFFFFF';
        item.dataType = dataType;
        frInfo.children.push(item);
      });
    };
    // 获取法人信息
    if (mapInfo.frinvList) { // 法人对外投资
      modifyFrData(mapInfo.frinvList, 'entName', 1);
    }
    if (mapInfo.frPositionList) { // 法人在外任职
      modifyFrData(mapInfo.frPositionList, 'entName', 1);
    }

    // 存入数据
    this.baseData.id = 'root';
    this.baseData.treename = mapInfo.companyName;
    this.baseData.dataType = 1;
    this.baseData.color = '#E5E5E5';
    this.baseData.children = [];
    this.baseData.children.push(frInfo);
    // 股东数据
    if (mapInfo.shareList) { // 股东
      getShareData(mapInfo.shareList, 'shareholderName', 2);
    }
    if (mapInfo.entinvList) { // 企业对外投资
      getShareData(mapInfo.entinvList, 'entName', 1);
    }
    this.dataLength = Math.round(this.baseData.children.length / 2) + frInfo.children.length;
    console.log('baseData---->', this.baseData);
    // console.log('dataLength---->', this.dataLength);
  }