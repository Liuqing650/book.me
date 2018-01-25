import React from 'react';
import { connect } from 'dva';
import LayoutComponent from '../components/layout';
import Book from '../components/book';
import User from '../components/user';
import ListCom from '../components/music';

function IndexPage({dispatch, location, main}) {
  const bookProps = {
    ...main,
    viewContent(data) {
      dispatch({
        type: 'main/viewContent',
        payload: data,
      })
    },
    onChangeValue(value) {
      dispatch({
				type: 'main/changeValue',
				payload: value,
			})
    },
    onAdd(data) {
      dispatch({
        type: 'main/addBook',
        payload: data,
      })
    },
    onUpdate(data, index) {
      dispatch({
        type: 'main/updateBook',
        payload: { ...data, index },
      })
    },
    onFinish(data, index) {
      dispatch({
        type: 'main/finishBook',
        payload: { ...data, index },
      })
    },
    onModify(data, index) {
      dispatch({
        type: 'main/modifyBook',
        payload: { ...data, index },
      })
    },
    onDelete(data, index) {
      dispatch({
        type: 'main/deleteBook',
        payload: {...data, index},
      })
    },
    onChangeLine(index) {
      dispatch({
        type: 'main/changeLine',
        payload: index,
      })
    },
    onResetMock(index) {
      dispatch({
        type: 'main/resetMock',
        payload: index,
      })
    }
  };
  const renderPage = (menus) => {
    if (menus === 'book') {
      return <Book {...bookProps} />;
    } else if (menus === 'user') {
      return <User {...bookProps} />;
    } else if (menus === 'music') {
      return <ListCom {...bookProps} />;
    }
  };
  return (
    <LayoutComponent {...bookProps}>
        {renderPage(main.selectedMenu)}
    </LayoutComponent>
  );
}

IndexPage.propTypes = {
};

export default connect(({main}) => ({main}))(IndexPage);
