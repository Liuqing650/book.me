import React from 'react';
import mockData from '../../utils/mock';
import styles from './index.less';
import { Button, Row, Col, Input, Icon, Progress, InputNumber, Switch } from 'antd';
const User = ({
  mock,
  onChangeLine,
  onChangeValue
}) => {
  const setup = () => {
    mock.data = mockData;
    onChangeValue({mock});
    onChangeLine(mock.index);
  };
  const onChangeInput = (even) => {
    const value = even.target.value;
    mock.value = value;
    onChangeValue({ mock });
    if (value == mock.temp.value) {
      mock.valid = false;
      onChangeValue({ mock });
    }
  };
  const onEnter = () => {
    if (!mock.valid) {
      onChangeLine(mock.index + 1)
    }
  };
  const onJumeChange = (even) => {
    mock.jump = even;
    onChangeValue({ mock });
  };
  const onJumeLine = () => {
    if (mock.data.length === 0) {
      setup();
    }
    onChangeLine(mock.jump - 1);
  };
  const changeCopy = () => {
    mock.copy = !mock.copy;
    onChangeValue({ mock });
  };
  const cssName = !mock.copy ? styles.text : null;
  const percent = mock.data.length > 0 ? Math.floor(((mock.index + 1) * 100) / mockData.length * 100) / 100 : 0;
  return (
    <div className={styles.warp}>
      <Row className={styles.line}>
        <Col span={3}>
          第{mock.data.length > 0 ? (mock.index + 1) : 0}行 {mock.temp.name}：
        </Col>
        <Col span={12}>
          <div className={cssName}>{mock.temp.value ? mock.temp.value : ''}</div>
          <Progress percent={percent} status="active" />
        </Col>
      </Row>
      <Row className={styles.line}>
        <Col span={3}>
            输入：
        </Col>
        <Col span={12}>
          <Input onChange={onChangeInput} value={mock.value} onPressEnter={onEnter} suffix={mock.valid ? <Icon type="question" /> : <Icon type="check" />} />
        </Col>
      </Row>
      <Row className={styles.line}>
        <Col span={3}>
          <Button onClick={setup}>开始</Button>
        </Col>
        <Col span={3}>
          <Button onClick={() => onChangeLine(mock.index + 1)} disabled={mock.valid}>下一行</Button>
        </Col>
        <Col span={3}>
          复制: <Switch checkedChildren="开" unCheckedChildren="关" checked={mock.copy} onChange={changeCopy} />
        </Col>
        <Col span={6}>
          <InputNumber min={0} max={mockData.length} onChange={onJumeChange} placeholder="跳行" />
          <Button onClick={onJumeLine}>跳行</Button>
        </Col>
      </Row>
    </div>
  );
};

User.propTypes = {
};

export default User;
