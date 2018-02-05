export default {

    namespace: 'main',

    state: {
      loginMenu: '登录',
      isShowModal: false,
      loginTabsIndex: '1',
      selectedMenu: 'user',
      loading: false,
      book: {
        id: '',
        content: null,
        userId: '',
        isUpdate: false,
        isEdit: false,
      },
      lineData: [
        { time: '2017-12-5', content: '哈哈', status: 0 },
        { time: '2017-12-8', content: '哈哈', status: 1 },
      ],
      baseData: {},
      treeData: {
        "id": "root",
        "name": "flare",
        "children": [{
          "name": "analytics",
          "children": [{
            "name": "cluster",
            "children": [{
              "name": "AgglomerativeCluster",
            }, {
              "name": "CommunityStructure",
            }, {
              "name": "HierarchicalCluster",
            }, {
              "name": "MergeEdge",
            }]
          }, {
            "name": "tree",
            "children": [{
              "name": "BetweennessCentrality",
            }, {
              "name": "LinkDistance",
            }, {
              "name": "MaxFlowMinCut",
            }, {
              "name": "ShortestPaths",
            }, {
              "name": "SpanningTree",
            }]
          }, {
            "name": "optimization",
            "children": [{
              "name": "AspectRatioBanker"
            }]
          }]
        }, {
          "name": "animate",
          "children": [{
            "name": "Easing",
          }, {
            "name": "FunctionSequence",
          }, {
            "name": "interpolate",
            "children": [{
              "name": "ArrayInterpolator",
            }, {
              "name": "ColorInterpolator",
            }, {
              "name": "DateInterpolator",
            }, {
              "name": "Interpolator",
            }, {
              "name": "MatrixInterpolator",
            }, {
              "name": "NumberInterpolator",
            }, {
              "name": "ObjectInterpolator",
            }, {
              "name": "PointInterpolator",
            }, {
              "name": "RectangleInterpolator",
            }]
          }, {
            "name": "ISchedulable",
          }, {
            "name": "Parallel",
          }, {
            "name": "Pause",
          }, {
            "name": "Scheduler",
          }, {
            "name": "Sequence",
          }, {
            "name": "Transition",
          }, {
            "name": "Transitioner",
          }, {
            "name": "TransitionEvent",
          }, {
            "name": "Tween",
          }]
        }]
      },
      mockData: {
        "frName": "张祖田",
        "frinvList": [],
        "companyName": "重庆永达精密机械有限公司",
        "entinvItemList": [],
        "frPositionList": [
          {
            "pid": "5FD647EF313FB23852E9BCFA27ABE4DB",
            "name": "张祖田",
            "regNo": "",
            "esDate": "2008-03-20",
            "frName": "",
            "regCap": "10.000000",
            "regOrg": "",
            "canDate": "",
            "entName": "重庆永煌机械有限公司",
            "entType": "",
            "revDate": "",
            "currency": "人民币元",
            "isBranch": "0",
            "position": "监事",
            "entStatus": "在营（开业）企业",
            "regCapCur": "人民币元"
          },
          {
            "pid": "5FD647EF313FB23852E9BCFA27ABE4DB",
            "name": "张祖田",
            "regNo": "",
            "esDate": "1999-09-17",
            "frName": "",
            "regCap": "1500.000000",
            "regOrg": "",
            "canDate": "",
            "entName": "重庆永达精密机械有限公司",
            "entType": "",
            "revDate": "",
            "currency": "",
            "isBranch": "0",
            "position": "董事长兼总经理",
            "entStatus": "存续(在营、开业、在册)",
            "regCapCur": "人民币"
          },
          {
            "pid": "5FD647EF313FB23852E9BCFA27ABE4DB",
            "name": "张祖田",
            "regNo": "",
            "esDate": "1999-09-17",
            "frName": "",
            "regCap": "1500.000000",
            "regOrg": "",
            "canDate": "",
            "entName": "重庆永达精密机械有限公司",
            "entType": "",
            "revDate": "",
            "currency": "",
            "isBranch": "0",
            "position": "法人",
            "entStatus": "存续(在营、开业、在册)",
            "regCapCur": "人民币"
          }
        ],
        "shareHolderList": [
          {
            "conDate": "",
            "country": "中国",
            "relConam": "0",
            "subConam": "94.174500",
            "regCapCur": "人民币",
            "fundedRatio": "35.27%",
            "shareholderName": "陈刚",
            "shareholderType": "自然人股东"
          },
          {
            "conDate": "",
            "country": "中国",
            "relConam": "0",
            "subConam": "90.000000",
            "regCapCur": "人民币",
            "fundedRatio": "33.71%",
            "shareholderName": "孙杰",
            "shareholderType": "自然人股东"
          },
          {
            "conDate": "",
            "country": "中国",
            "relConam": "0",
            "subConam": "34.335000",
            "regCapCur": "人民币",
            "fundedRatio": "12.86%",
            "shareholderName": "陈玉娇",
            "shareholderType": "自然人股东"
          },
          {
            "conDate": "",
            "country": "中国",
            "relConam": "0",
            "subConam": "28.852500",
            "regCapCur": "人民币",
            "fundedRatio": "10.81%",
            "shareholderName": "杨军",
            "shareholderType": "自然人股东"
          },
          {
            "conDate": "",
            "country": "中国",
            "relConam": "0",
            "subConam": "19.619500",
            "regCapCur": "人民币",
            "fundedRatio": "7.35%",
            "shareholderName": "邓挺",
            "shareholderType": "自然人股东"
          }
        ]
      }
    },

    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
        history.listen( location => {
          if(location.pathname === '/') {
            dispatch({
              type:'handleData'
            })
          }
        });
      },
    },

    effects: {
      *fetch({ payload }, { call, put }) {
        yield put({ type: 'save' });
      },
      // 笔记
      *addBook({ payload }, { call, put }) {
        yield put({ type: 'update' });
      },
      *finishBook({ payload }, { call, put }) {
        yield put({ type: 'save' });
      },
      *updateBook({ payload }, { call, put }) {
        yield put({ type: 'update' });
      },
      *deleteBook({ payload }, { call, put }) {
        console.log('payload---->', payload);
        yield put({ type: 'save' });
      },
      // 登录
      *login({ payload }, { call, put }) {
        yield put({ type: 'changeValue' });
      },
      *addUser({ payload }, { call, put }) {
        yield put({ type: 'changeValue' });
      }
    },

    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      update(state, action) {
        return { ...state, ...action.payload };
      },
      changeValue(state, action) {
        return { ...state, ...action.payload };
      },
      modifyBook(state, action) {
        state.book.isEdit = true;
        state.book.isUpdate = true;
        state.book.content = action.payload.content;
        return { ...state };
      },
      viewContent(state, action) {
        state.book.isEdit = false;
        state.lineData.push(action.payload);
        return { ...state };
      },
      changeLine(state, action) {
        let index = action.payload;
        if (index > state.mock.data.length - 1) {
          index = state.mock.data.length - 1;
        }
        if (index < 0) {
          index = 0;
        }
        state.mock.temp = state.mock.data[index];
        state.mock.index = index;
        state.mock.valid = true;
        state.mock.value = '';
        return { ...state };
      },
      handleData(state, action) {
        state.baseData = {};
        let baseData = {};
        const structureMapping = (data) => {
          const mapInfo = {
            companyName: data.companyName ? data.companyName : '--', // 企业名称
            frname: data.frName ? `法人代表(${data.frName})` : '--', // 华人代表
            entinvList: data.entinvItemList && data.entinvItemList.length > 0 ? data.entinvItemList : false, // 企业对外投资
            shareList: data.shareHolderList && data.shareHolderList.length > 0 ? data.shareHolderList : false, // 股东
            frinvList: data.frinvList && data.frinvList.length > 0 ? data.frinvList : false, // 法人对外投资
            frPositionList: data.frPositionList && data.frPositionList.length > 0 ? data.frPositionList : false, // 法人在外任职
          };
          const frInfo = {
            treename: mapInfo.frname,
            color: '#E5E5E5',
            circle: true, // 人名为圆形
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
          // 获取股东数据
          const getShareData = (arrData, keys, circle = false) => {
            arrData.map((item) => {
              item.treename = item[keys];
              item.treeInfo = handleLabel(item);
              item.treeKey = keys;
              item.color = '#FFFFFF';
              item.circle = circle;
              baseData.children.push(item);
            });
          };
          // 获取法人信息
          const modifyFrData = (arrData, keys, isFr, circle = false) => {
            arrData.map((item) => {
              item.treename = `${item[keys]}${item[keys]}`;
              item.treeInfo = handleLabel(item, isFr);
              item.treeKey = keys;
              item.color = '#FFFFFF';
              item.circle = circle;
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
          baseData.id = 'root';
          baseData.treename = mapInfo.companyName;
          baseData.circle = false;
          baseData.color = '#E5E5E5';
          baseData.children = [];
          baseData.children.push(frInfo);
          // 股东数据
          if (mapInfo.shareList) {
            getShareData(mapInfo.shareList, 'shareholderName', true);
          }
          if (mapInfo.entinvList) {
            getShareData(mapInfo.entinvList, 'entName');
          }
        }
        structureMapping(Object.assign({}, state.mockData));
        state.baseData = baseData;
        console.log(baseData);
        return { ...state };
      }
    },

  };
