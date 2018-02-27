# mock

https://github.com/nuysoft/Mock/wiki/Syntax-Specification

# 语法规范
Mock.js 的语法规范包括两部分：

1. 数据模板定义规范 （Data Template Definition，DTD）
2. 数据占位符定义规范 （Data Placeholder Definition，DPD）

# 数据模板定义规范 DTD

数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：

```
  // 属性名   name
  // 生成规则 rule
  // 属性值   value
  'name|rule': value
```
# 数据占位符定义规范 DPD (推荐)

占位符 只是在属性值字符串中占个位置，并不出现在最终的属性值中。

占位符 的格式为：

```
  @占位符
  @占位符(参数 [, 参数])
```

举例：

```
  const data = Mock.mock({
    'data|20-30': [
      {
        'id|+1': 1, // 依次 +1 的id
        'name': '@cname', // 中文名字
        'email': '@email', // 邮箱
        'address': '@city', // 城市
        // 生成一个 80 x 80 的背景颜色为 #ffcc33，前景颜色为 #FFF 文字为英文首个名字 `@first` 的 png 格式图片
        'avator': `@image('80x80', '#ffcc33', '#FFF', 'png', '@first')`
      }
    ]
  });
```
