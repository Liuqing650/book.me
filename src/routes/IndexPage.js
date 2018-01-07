import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;
function IndexPage() {
  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }
  const optionsWithDisabled = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ];
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to dva!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
        <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
        <li><a href="https://www.npmjs.com/package/maby-cli" target="_blank;">How To Start ?</a></li>
        <li><a href="https://github.com/Liuqing650/antd-maby" target="_blank;">Get maby-cli</a></li>
      </ul>
      <CheckboxGroup options={optionsWithDisabled} defaultValue={['Apple']} onChange={onChange} />
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
