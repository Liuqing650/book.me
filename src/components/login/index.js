
import { Form, Icon, Input, Modal, Button, Tabs } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const login = ({
  isShowModal,
  loginTabsIndex,
  onChangeValue,
  children,
  form,
}) => {
  const { getFieldDecorator,resetFields } = form;
  const tabsData = [
    {
      key: '1',
      name: '登录',
    }, {
      key: '2',
      name: '注册',
    }
  ];
  const onSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        return false;
      }
    });
  };
  const createForm = () => {
    return (
      <Form onSubmit={onSubmit}>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入您的用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
      </Form>
    );
  }
  const createTabs = (data) => {
    const outPut = [];
    data.map((item) => {
      outPut.push(<TabPane tab={item.name} key={item.key}>{createForm()}</TabPane>);
    });
    return outPut;
  }
  const onTabsChange = (key) => {
    resetFields();
    onChangeValue({loginTabsIndex: key});
  }
  return (
    <div>
      <Modal
          title={loginTabsIndex === '2' ? "注册账号": "登录"}
          visible={isShowModal}
          onOk={onSubmit}
          mask={false}
          width={360}
          onCancel={() => onChangeValue({isShowModal: false})}
          okText="确认"
          cancelText="取消"
        >
          <Tabs defaultActiveKey="1" onChange={onTabsChange}>
            {createTabs(tabsData)}
          </Tabs>
        </Modal>
    </div>
  );
}
export default Form.create()(login);
