
export default {

    namespace: 'main',

    state: {
      loginMenu: '登录',
      isShowModal: false,
      loginTabsIndex: '1',
      selectedMenu: 'book',
      htmlContent: null,
      loading: false,
      isEdit: false,
      lineData: [
        {time:'2017-12-5',content:'哈哈', status: 0},
        {time:'2017-12-8',content:'哈哈', status: 1},
      ]
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
      changeValue(state, action) {
        return { ...state, ...action.payload };
      },
      view(state, action) {
        state.lineData.push(action.payload);
        return { ...state };
      }
    },

  };
