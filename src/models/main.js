
export default {
  
    namespace: 'main',
  
    state: {
      loginMenu: '登录',
      isShowModal: false,
      loginTabsIndex: '1',
      selectedMenu: 'book',
      loading: false
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
    },
  
  };
  