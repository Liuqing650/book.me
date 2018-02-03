
  @action.bound structureMapping(data) {
    console.log('data----->', data);
    this.baseData = {};
    const mapInfo = {
      companyName: data.companyName ? data.companyName : '--', // 企业名称
      frname: data.frName ? `法人代表\n${data.frName}` : '--', // 华人代表
      entinvList: data.entinvItemList && data.entinvItemList.length > 0 ? data.entinvItemList : false, // 企业对外投资
      shareList: data.shareHolderList && data.shareHolderList.length > 0 ? data.shareHolderList : false, // 股东
      frinvList: data.frinvList && data.frinvList.length > 0 ? data.frinvList : false, // 法人对外投资
      frPositionList: data.frPositionList && data.frPositionList.length > 0 ? data.frPositionList : false, // 法人在外任职
    };
    const frInfo = {
      treename: mapInfo.frname,
      layer: 1,
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
      if (isFr) {
        output.text = '担任法人';
        return output;
      }
      temp.date = itemData.conDate ? itemData.conDate : '--';
      temp.invest = itemData.subConam ? itemData.subConam : '--';
      temp.ratio = itemData.fundedRatio ? itemData.fundedRatio : '--';
      output.text = `${config.date}: ${temp.date}\n${config.invest}: ${temp.invest}\n${config.ratio}: ${temp.ratio}\n`;
      return output;
    };
    // 获取股东数据
    const getShareData = (arrData, keys) => {
      arrData.map((item) => {
        item.treename = item[keys];
        item.treeInfo = handleLabel(item);
        item.treeKey = keys;
        item.layer = 1;
        this.baseData.children.push(item);
      });
    };
    // 获取法人信息
    const modifyFrData = (arrData, keys, isFr) => {
      arrData.map((item) => {
        item.treename = item[keys];
        item.treeInfo = handleLabel(item, isFr);
        item.treeKey = keys;
        item.layer = 2;
        frInfo.children.push(item);
      });
    };
    // 获取法人信息
    if (mapInfo.frinvList) {
      modifyFrData(mapInfo.frinvList, 'entName');
    }
    if (mapInfo.frPositionList) {
      modifyFrData(mapInfo.frPositionList, 'entName', true);
    }

    // 存入数据
    this.baseData.id = this.idParams.reportId;
    this.baseData.treename = mapInfo.companyName;
    this.baseData.layer = 0;
    this.baseData.children = [];
    this.baseData.children.push(frInfo);
    // 股东数据
    if (mapInfo.shareList) {
      getShareData(mapInfo.shareList, 'shareholderName');
    }
    if (mapInfo.entinvList) {
      getShareData(mapInfo.entinvList, 'entName');
    }
    console.log(this.baseData);
  }