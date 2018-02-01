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
      }
    },

    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
        history.listen( location => {
          if(location.pathname === '/') {
            dispatch({
              type:'fetch',
              payload: location.query,
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
      }
    },

  };
