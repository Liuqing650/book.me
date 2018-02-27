import Mock from 'mockjs';
const list = Mock.mock({
  'list|1-10': [{
    'id|+1': 1
  }]
});
const data = Mock.mock({
  'data|20-30': [
    {
      'id|+1': 1,
      'name': '@cname',
      'email': `@email('qq.com')`,
      'address': '@city',
      'avator': `@image('80x80', '#ffcc33', '#FFF', 'png', '@first')`
    }
  ]
});
