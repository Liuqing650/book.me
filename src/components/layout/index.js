import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Login from '../login';
import Editor from '../edit';
import styles from './index.less';

const { Header, Content, Footer } = Layout;

const LayoutComponent = (props) => {
  const { isShowModal, loginMenu, onChangeValue, isEdit, children} = props;
  const menus = {
    book: '记事本',
    user: '个人中心',
    login: loginMenu,
  }
  const onLogin = () => {
    const isLogin = localStorage.getItem("isLogin");
    if (!isLogin) {
      onChangeValue({isShowModal: true});
    } else {
      onChangeValue({loginMenu: localStorage.getItem("nickName")});
    }
  };
  const handleClick = (menu) => {
    onChangeValue({selectedMenu: menu.key});
    switch (menu.key) {
      case 'login': onLogin();
        break;
      default:
        break;
    }
  };
  const creatMenu = (data) => {
    const outPut = [];
    Object.keys(data).map((key) => {
      if (key === 'login') {
        outPut.push(<Menu.Item key={key} style={{float: 'right'}}>{menus[key]}</Menu.Item>);
      } else {
        outPut.push(<Menu.Item key={key}>{menus[key]}</Menu.Item>);
      }
    });
    return outPut;
  };
  const cssName = `${isEdit ? styles.showTag : styles.hideTag}`;
  const onAddItem = () => {
    onChangeValue({isEdit: !isEdit});
  };
  return (
    <div>
      <Layout style={{background: '#fff'}}>
        <Header className={styles.headerStyle}>
          <div className="logo" />
          <Menu
            mode="horizontal"
            onClick={handleClick}
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            {creatMenu(menus)}
          </Menu>
        </Header>
        <Content className={styles.content}>
          <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
            {children}
          </div>
          <div className={cssName}>
            <div className={styles.downButton} onClick={onAddItem}><Icon type={isEdit ? 'caret-down' : 'caret-up'} /></div>
            <div className={isEdit ? styles.editContent : null}>
              {isEdit ? <Editor {...props} /> : null}
            </div>
          </div>
        </Content>
        <Footer className={styles.footerStyle}>
          Book.me ©2018 mabylove.cn
        </Footer>
      </Layout>
      <Login {...props} />
    </div>
  );
}
export default LayoutComponent;
