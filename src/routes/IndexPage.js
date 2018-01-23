import React from 'react';
import { connect } from 'dva';
import LayoutComponent from '../components/layout';
import Book from '../components/book';
import User from '../components/user';

function IndexPage({dispatch, main}) {
  const bookProps = {
    ...main,
    onChangeValue(value) {
      dispatch({
				type: 'main/changeValue',
				payload: value,
			})
    }
  };
  const renderPage = (menus) => {
    if (menus === 'book') {
      return <Book {...bookProps} />;
    } else if (menus === 'user') {
      return <User />;
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
