# Antv/g6
----

[G6](https://antv.alipay.com/zh-cn/g6/1.x/index.html) 是一个由纯 JavaScript 编写的关系图基础技术框架。

> 安装： npm install @antv/g6 --save

[TOC]

## Example
```
import G6 from '@antv/g6';

// 生成 id
function generateUniqueId() {
  return `rc-g6-1`;
}
class Chart extends Component {
  constructor(props) {
    super(props);
    this.graph = null;
    this.graphId = generateUniqueId();
  }

  componentDidMount() {
    this.drawTree(this.props);
  }

  // 绘画树型图
  drawTree(props) {
    const graph = new G6.Tree({ 
      id: this.graphId,
      height: 600,
      fitView: 'autoZoom',
      layoutCfg: {
        direction: 'V',
        getHGap: () => { return 35;},
        getVGap: () => { return 80;}
      }
    });
    graph.source(props.data);
    graph.node().label((obj) => {
      return obj.name;
    });
    graph.edge().shape('smooth');
    this.graph = graph;
    this.graph.render();
  }

  render() {
    return (
      <div>
        <div id={this.graphId}></div>
      </div>
    );
  }
}

export default Chart;
```

## 效果图

![树型图效果预览](http://img.mabylove.cn/g6/树形图效果.png)

## 使用步骤

### 1. 传递数据

树形图需要传递的数据基本格式为
```
{
  "name": "@ali/g6"，
  "children" : [
    {
      "name": "@ali/color-cal"，
        ...
    }
  ], 
}
```

### 2. 引入G6，设置 id， React 可以写一个 id生成函数。

```
import G6 from '@antv/g6';

function generateUniqueId() {
  return `rc-g6-1`;
}
```

### 3. 构造函数时初始化所需要的变量

```
  constructor(props) {
    super(props);
    this.graph = null; // 图形
    this.graphId = generateUniqueId(); // 图形id
  }
```

### 4. 创建外层元素标签

```
<div id={this.graphId}></div>
```

### 5. 创建绘画 **G6** 图形函数
  G6 包含了很多的方法
  ![](http://img.mabylove.cn/g6/G6的函数.png)

  - 图基类：[G6.Graph](https://antv.alipay.com/zh-cn/g6/1.x/api/graph.html) 
  - 网图类：[G6.Net](https://antv.alipay.com/zh-cn/g6/1.x/api/net.html)
  - 树图类：[G6.Tree](https://antv.alipay.com/zh-cn/g6/1.x/api/tree.html)
  - 处理类：[G6.Handler](https://antv.alipay.com/zh-cn/g6/1.x/api/handler.html)
  - 绘图类：[G6.Canvas](https://antv.alipay.com/zh-cn/g6/1.x/api/canvas.html)
  - 矩阵类：[G6.Matrix](https://antv.alipay.com/zh-cn/g6/1.x/api/matrix.html)
  - 工具类：[G6.Util](https://antv.alipay.com/zh-cn/g6/1.x/api/util.html)
  - 布局包：[G6.Layouts](https://antv.alipay.com/zh-cn/g6/1.x/api/layouts.html)
  - 全局配置项：[G6.Global](https://antv.alipay.com/zh-cn/g6/1.x/api/global.html)
  
```
  drawTree(props) {
    const graph = new G6.Tree({
      ... // 关系图配置
    });
  }
```

### 6. 配置 **G6.Tree**
  - G6.Graph 是所有上层图类的基类，Net 网、 Tree 树，都继承于Graph。
  - 所以 `关系图配置`的 [属性和方法](https://antv.alipay.com/zh-cn/g6/1.x/api/graph.html) 参考 Graph 的API即可。
  - 绘制任何图形需指定 `id 和 height` 宽度不指定会根据父节点自适应。高度默认是 `height: 500px;`
  - [G6.Tree](https://antv.alipay.com/zh-cn/g6/1.x/api/tree.html) 支持 [布局](https://antv.alipay.com/zh-cn/g6/1.x/api/layouts.html) `layoutCfg`，

```
drawTree(props) {
    const graph = new G6.Tree({
      id: this.graphId,
      height: 600,
      fitView: 'autoZoom', // 自动缩放到屏幕中间
      layoutCfg: {
        direction: 'V',  // 树布局方向(V:根节点在中间，上下布局)
        getHGap: () => { return 35;}, // 每个节点的水平间隙
        getVGap: () => { return 80;} // 每个节点的垂直间隙
      }
    });
  }
```

### 7. 节点、边的映射，渲染数据
[节点映射：](https://antv.alipay.com/zh-cn/g6/1.x/api/graph.html#_node) `graph.node().label(param)` 主要将文本信息映射到节点上。
[边映射：](https://antv.alipay.com/zh-cn/g6/1.x/api/graph.html#_edge) `graph.edge().shape(param)` 主要映射出边形状。

边映射和节点映射都可以自定义，参考 [自定义节点、边](#注册节点)。

```
  drawTree(props) {
    const graph = new G6.Tree(
      ... // 关系图配置
    );
    graph.source(props.data); // 数据输入：一个树型结构的对象
    graph.node().label((obj) => { // 节点映射
      return obj.name;
    });
    graph.edge().shape('smooth'); // 边映射
    this.graph = graph;
    this.graph.render(); // 渲染数据
  }
```
> 这时绘制树型结构的 **G6.Tree** 已经完成。

[点此查看完整代码](#example)

### 8. 调用绘画函数 `drawTree();`

```
  componentDidMount() {
    this.initTree(this.props); // 调用绘画函数，绘制树形图
  }
```
[查看效果](#效果图)

----
## API 简化版

### [自定义节点、边](https://antv.alipay.com/zh-cn/g6/1.x/tutorial/custom-shape.html#_概述)
> **G6 中有两个静态方法：** `registerNode` 和 `registerEdge`
> **作用：** 对任何的节点和边进行自定义

#### 注册节点
```
G6.registerNode(name, {
  draw(cfg, group){ // 绘制
    const keyShape = group.addShape('rect', {
      attrs: {
        width: 100,
        height: 100,
        stroke: 'red'
      }
    });
    return keyShape;
  },
  afterDraw(cfg, group, keyShape){ // 绘制后执行
    ...
  },
  getAnchorPoints(cfg){ // 获取锚点
    return anchorPoints;
  }
});
```

| 属性名 | 描述 | 举例 | 类型 | 
| - | :- | :- | - |
| draw | draw 是子项最终绘制的接口<br>决定了一个子项最终画成什么形 | ![](https://zos.alipayobjects.com/skylark/c2f10ada-bb93-44ac-af2c-ba869876be82/attach/2816/40fdb36628bbba8b/image.png) | Function |
| afterDraw | 基于当前形的基础上添加一些信息 | |
| getAnchorPoints | 自定义锚点 | | Function |
| name | 节点名称 |如 `name` 为: `treeNode`<br>使用 `graph.node().shape('treeNode');` | String | 
| cfg | 配置项 | 获取原始数据<br>`const model = cfg.model;`  | Object | 
| group | 绘图容器、绘图引擎 | `group.addShape('text', {attrs: {text: '文本节点\n 换一行'}})；` | Object |
| keyShape | 关键形<br>该子项参与图形计算的关键图形<br>所有的击中、锚点、控制点 都是根据关键图形生成的 | `group.addShape(name, {...})` | Function

group 使我们有画图的能力，cfg 则是绘制一个子项的配置信息。其三个视觉通道位置、大小、颜色和一个原始数据。一个子项的形态就由这个四个信息决定！
 * 位置：cfg.x, cfg.y
 * 颜色：cfg.color
 * 尺寸：cfg.size
 * 原始数据：cfg.model

 

##### addShape(name, {...}) 方法
用于绘制各种图形

| 属性名 | 描述 | 类型 | 
| - | :- | - |
| name | 图形名称<br>G6 内置一些基础的节点如：矩形 `rect` 、圆形 `circle` 、文本 `text` 、菱形 `rhombus` ;<br>一些基础的边如：直线 `line` 、箭头 `arrow` 、曲线 `smooth` 、曲线箭头 `smoothArrow` 。 | String |
| {...} | 图形属性<br>例如 `attr:{width: 100,height: 100,stroke: 'red'}` | Object


#### 注册边
```
G6.registerEdge(name, {
  draw(cfg, group){ // 绘制
    return keyShape;
  },
  afterDraw(cfg, group, keyShape){ // 绘制后执行

  }
});
```
| 属性名 | 描述 | 举例 | 类型 | 
| - | :- | :- | - |
| name | 边名称 |如 `name` 为: `treeEdge`<br>使用 `graph.edge().shape('treeEdge');` | String | 
| cfg | 边内容 | 获取原始数据<br>`const model = cfg.target.getModel();`  | Object | 
| group | 绘图容器、绘图引擎 | `group.addShape('text', {text: '文本节点\n 换一行'})；` | Object |
| keyShape | 和节点相同 | | Function |

 - 边控制点：points // 理论上 points 可以有无穷多个点，从 points[0] 到 points[n]，依次是源节点到目标节点的控制点位置。
 - 目标节点： cfg.target // 目标节点
 - 源节点：cfg.source // 源节点
 - 颜色：cfg.color
 - 尺寸：cfg.size
 - 原始数据：cfg.model

> 注意：
> 1. 绘制节点(Node)的位置信息是：cfg.x、cfg.y。而边(Edge)的是 points
> 2. 由于画边相对复杂，不建议大家直接复写 draw 方法， 而是使用 `afterDraw(cfg, group, keyShape) {...}`。

#### 特殊用例

在进行节点形状映射的时候，有部分图形内置了形状，如： `smooth`, `line`, `arrow` 等。期望依据内置形状进行美化，那么可以在 G6.registerEdge()中指定

```
G6.registerEdge(name, {
  afterDraw(cfg, group, keyShape) {...};
}, 'smooth'); 
// 第三个参数 smooth 指定了该树形图将以平滑的贝塞尔曲线链接各个节点
```

### 事件绑定

```
/**
 * 事件绑定
 * @param  {String}   eventType 事件类型
 * @param  {Function} fn(ev)    回调函数
 */
graph.on(eventType,fn);
```
ev 是事件对象，含下列字段：

 - x 在画布上的坐标x
 - y 在画布上的坐标y
 - domX 相对于画布容器的坐标x
 - domY 相对于画布容器的坐标y
 - item 节点或者边
 - shape 当前的形
 - itemType 'node' or 'edge'
 - toEvObj 到达的目标事件对象 （mouseleave时可用）

```
graph.on('click', function(ev){});           // 鼠标左键单击事件
graph.on('dblclick', function(ev){});        // 鼠标左键双击事件
graph.on('mousedown', function(ev){});       // 鼠标左键按下事件
graph.on('mouseup', function(ev){});         // 鼠标左键抬起事件
graph.on('mousemove', function(ev){});       // 鼠标移动事件
graph.on('dragstart', function(ev){});       // 开始拖拽事件
graph.on('dragmove', function(ev){});        // 拖拽中事件
graph.on('dragend', function(ev){});         // 拖拽结束后事件
graph.on('contextmenu', function(ev){});     // 鼠标右键点击事件
graph.on('mouseenter', function(ev){});      // 鼠标进入元素事件
graph.on('mouseleave', function(ev){});      // 鼠标离开元素事件
graph.on('keydown', function(ev){});         // 键盘按键按下事件
graph.on('keyup', function(ev){});           // 键盘按键抬起事件
graph.on('mousewheel', function(ev){});      // 鼠标滚轮事件
graph.on('itemactived', function(ev){});     // 子项激活后事件
graph.on('itemunactived', function(ev){});   // 子项取消激活后事件
graph.on('itemhover', function(ev){});       // 子项鼠标悬浮事件
graph.on('itemupdate', function(ev){});      // 子项更新后事件
graph.on('itemremove', function(ev){});      // 子项移除后事件
graph.on('itemadd', function(ev){});         // 添加子项结束后
graph.on('itemmouseenter', function(ev){});  // 子项鼠标进入事件
graph.on('itemmouseleave', function(ev){});  // 子项鼠标离开事件
graph.on('afteritemrender', function(ev){}); // 子项渲染结束后事件
graph.on('beforeinit', function(ev){});      // 初始化前事件
graph.on('afterinit', function(ev){});       // 初始化后事件
graph.on('beforerender', function(ev){});    // 绘制前事件
graph.on('afterrender', function(ev){});     // 绘制后事件
```

如果需要解除事件可以使用 `off`

```
/**
 * 事件解除
 * @param  {String}   eventType 事件类型
 * @param  {Function} fn        回调函数
 */
graph.off(eventType,fn);
```

> 注意： 目前已知的是 `mousewheel` 事件不支持 Firefox 浏览器。
> 所以在 Firefox浏览器上使用滚轮缩放会失效。

### 更新子项和查找子项
树状图等针对某一项进行修改后，`update` 可以直接更新该处，而不影响其他地方。

如果数据过多，期望进行搜索某些相似的项时， `find` 可以查找到具体的某一项，此处可以扩展到文字模糊匹配等。

- update 更新子项
```
/**
 * 更新子项数据模型
 * @param  {Item|String}   param
 * @param  {Object} model
 */
graph.update(param, model)
```
- find 查找子项
```
/**
 * 通过 id 查找子项
 * @param  {String} id
 */
graph.find(id)
```

### 数据的存储(提取)

在可编辑图形中可以提取出当前图形的数据

- save 提取数据
```
/**
 * 存数据
 * @return {Object} data
 */
graph.save();
```
![](http://img.mabylove.cn/g6/%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96.png)

## 复杂功能阐述

实际开发过程之中，由于 `G6` 暂未开源， 部分功能又不完善， 需要寻找解决新的方式。

### 两个 canvas

画布中分为两层 canvas, 第一层用于展示图形，第二层用于行为交互。分别会以 `id=canvas_1` 和 `id=canvas_2` 进行标记。

### 两个坐标系

画布中，拥有两个坐标系： **dom坐标系** 和 **node坐标系**

dom坐标系： 以canvas的原点(左上角)为原点的坐标系
node坐标系：以 `layoutCfg` 布局中根节点位置为原点的坐标系

图形中每一个节点(node) 都会包含以上两个坐标的值， **dom坐标** 用于标识当前的节点在 `canvas` 上的位置。 **node坐标** 用于标识当前节点相对于根节点的位置，即在 **node坐标系** 中的位置。

```
    |(canvas原点) dom坐标系
  ──┼──────────────────────────
    |           |
    |           |
    |   iii     |    iiii
    |           |
    |-----------(graph-center) node坐标系
    |           |
    |    ii     |    i
    |           |

            （图）
```

平移是修改了在 **dom坐标系** 中的位置
缩放是放大了 **dom坐标系** 的比例

### 缩放功能

```
  const ratio = 1; // 缩放系数 [0 ~ 10]
  const matrix = new G6.Matrix.Matrix3(); // 三阶矩阵
  matrix.scale(ratio, ratio); // 仿射缩放
  graph.updateMatrix(matrix); // 更新画布根节点矩阵
  graph.refresh(); // 刷新画布
```

### 平移功能

```
  const root = {x: 10, y: 10}; // 平移位置
  const matrix = new G6.Matrix.Matrix3(); // 三阶矩阵
  matrix.translate(root.x, root.y); // 仿射平移
  graph.updateMatrix(matrix); // 更新画布根节点矩阵
  graph.refresh(); // 刷新画布
```
