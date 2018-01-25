import { Layout, Menu } from 'antd';
import Login from '../login';
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
        outPut.push(<Menu.Item disabled={key === 'book'} key={key}>{menus[key]}</Menu.Item>);
      }
    });
    return outPut;
  };
  return (
    <div>
      <Layout style={{background: '#fff'}}>
        <Header className={styles.headerStyle}>
          <div className="logo" />
          <Menu
            mode="horizontal"
            onClick={handleClick}
            defaultSelectedKeys={['user']}
            style={{ lineHeight: '64px' }}
          >
            {creatMenu(menus)}
          </Menu>
        </Header>
        <Content className={styles.content}>
          {children}
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
