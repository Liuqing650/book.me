import React, { Component } from 'react';
import G6 from '@antv/g6';
import Plugins from '@antv/g6-plugins';
import html2canvas from 'html2canvas';
// const miniMap = new Plugins['tool.minimap']();
console.log(G6);
let Global = G6.Global;
let Util = G6.Util;
let Matrix = G6.Matrix;
function generateUniqueId(isDeep) {
  return isDeep ? `rc-g6-1` : `rc-g6-0`;
}
G6.registerEdge('treeEdge', {
  draw(cfg, group){
    console.log('cfg--->', cfg);
    group.addShape('rect', {
      attrs: {
        x: (cfg.points[0].x + cfg.points[1].x - 155)/2,
        y: (cfg.points[0].y + cfg.points[1].y - 35)/2,
        width: 150,
        height: 30,
        stroke: 'black',
        fill: '#000'
      }
    });
    group.addShape('text', {
      attrs: {
        x: (cfg.points[0].x + cfg.points[1].x)/2,
        y: (cfg.points[0].y + cfg.points[1].y)/2,
        fill: '#f00',
        lineWidth: 10,
        text: '我是一个自定义边（edge）',
        textAlign: 'center'
      }
    });
    return group.addShape('polyline', {
      attrs: {
        points: [
          [cfg.points[0].x, cfg.points[0].y],
          [cfg.points[1].x, cfg.points[1].y]
        ],
        stroke: cfg.color,
        lineWidth: cfg.size
      }
    });
  }
})
class Chart extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      node: {},
      isSave: false, // 存储状态
      isRead: false, // 阅读模式
    }
    // id生成函数
    this.graphId = generateUniqueId();
    this.graph = null;
    this.graphContainer = null;
    this.deepGraphId = generateUniqueId(true);
    this.deepGraph = null; // 用作下载
    this.deepGraphContainer = null;
    this.input = this.createInput();

    this.mouseEnterNodeStyle = {
			lineWidth: 2,
      stroke: '#FF0',
		};

		this.nodeStyle = {
      lineWidth: 1
		};
  }

  componentDidMount() {
    this.initTree(this.props);
  }

  initTree(props) {
    const graph = new G6.Tree({
      id: this.graphId,
      fitView: {                      // 自动对齐到中心点
        x: 0,
        y: 0
      },
      // plugins: [ miniMap ],
      ...props
    });
    graph.tooltip(true);
    this.graphContainer = graph.get('graphContainer');
    this.graphContainer.appendChild(this.input);
    graph.addBehaviour('default', ['clickActive', 'clickBlankClearActive']);
    graph.node().label('name').style(this.nodeStyle);
    // graph.edge().shape('smooth');
    graph.edge().label((data) => {
      const allData = [this.graph.save().source];
      const parent = this.findNodeDataById(allData, data.source);
      const node = this.findNodeDataById(allData, data.target);
      const angle = (start,end) => {
        const diff_x = end.x - start.x;
        const diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
      }
      return {
        text: node.name,
        lineWidth: node.name.length * 2,
        fill: 'green',
        // textBaseline: 'Bottom',
        rotate: angle(parent, node)
      };
    }).style({
      lineWidth: 1,
      stroke: 'green'
    });
    graph.edge().color((data) => {
      const allData = [this.graph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      return node.name.indexOf('an') > -1 ? '#FF0' : '#222';
    })
    graph.edge().tooltip((data) => {
      const allData = [this.graph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      // console.log('node--->', node)
      return [['路径标识',node.name]];
    })
    graph.node().tooltip(function(obj){
      return [
        ['简要信息', obj.name]
      ]
    });
    graph.source(this.props.data);
    this.graph = graph;
    this.graph.render();
    // this.graph.on('itemmouseenter', this.onMouseEnter);
    // this.graph.on('itemmouseleave', this.onMouseLever);

    this.graph.on('dblclick', this.onDbClick);
    this.input.on('keydownInput', this.onKeyDownInput);
    this.graph.on('blur', this.onBlurG6);
  }

  createDeepTree = (props) => {
    const deepGraph = new G6.Tree({
      id: this.deepGraphId,
      fitView: {
        x: 0,
        y: 0
      },
      ...props,
      height: '1000'
    });
    this.deepGraphContainer = deepGraph.get('graphContainer');
    deepGraph.node().label('name').style(this.nodeStyle);
    deepGraph.edge().shape('smooth');
    deepGraph.edge().label((data) => {
      const allData = [this.deepGraph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      // console.log('node--->', node)
      return node.name;
    })
    deepGraph.edge().color((data) => {
      const allData = [this.deepGraph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      return node.name.indexOf('an') > -1 ? '#FF0' : '#222';
    })
    deepGraph.source(this.props.data);
    this.deepGraph = deepGraph;
    this.deepGraph.render();
  }

  createInput = () => {
    const input = Util.createDOM('<input class="g6-label-input" />', {
      position: 'absolute',
      zIndex: 10,
      display: 'none'
    });
    return input;
  }
  downloadCurrentImage = () => {
    this.createDeepTree(this.props);
    this.graph.autoZoom(); // 缩放到适应大小
    this.deepGraph.autoSize();
    setTimeout(() => {
      this.drawImageUpdate();
    }, 1000);
  };

  findNodeDataById = (nodeData, nodeId) => {
    let output = {};
    let stop = false;
    const loop = (data) => {
      if (!stop) {
        data.map((item) => {
          if (item.id === nodeId) {
            output = item;
            stop = true;
          }
          if (!stop && item.children) {
            loop(item.children);
          }
        })
      }
    };
    loop(nodeData);
    return output;
  };

  downloadImage = () => {
    const matrixStash = this.graph.getMatrix(); // 缓存当前矩阵
    this.graph.changeSize(1600, 1200);
    // const tempCanvas = document.createElement('canvas');
    // var canvas = this.graph.get('graphContainer').getElementsByTagName('canvas');
    // console.log('canvas--->', canvas[0]);
    // var ctx = canvas[1].getContext("2d");
    // ctx.drawImage(canvas[0], 0, 0);
    // ctx.drawImage(canvas[1], 0, 0);
    // .drawImage(canvas, 0, 0);
    html2canvas(this.graph.get('graphContainer')).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const saveName = 'graph.png';
      link.download = saveName;
      link.href = dataURL.replace('image/png', 'image/octet-stream');
      link.click();
      this.graph.updateMatrix(matrixStash); // 还原矩阵
      this.graph.refresh();
    });
  }

  drawImageUpdate = () => {
    const matrixStash = this.graph.getMatrix();
    const canvasArr = this.deepGraph.get('graphContainer').getElementsByTagName('canvas');
    canvasArr[0].getContext('2d').drawImage(canvasArr[1], 0, 0);
    const dataURL = canvasArr[0].toDataURL('image/jpeg');
    const link = document.createElement('a');
    const saveName = 'graph.jpeg';
    link.download = saveName;
    link.href = dataURL.replace('image/jpeg', 'image/octet-stream');
    link.click();
    this.deepGraph.updateMatrix(matrixStash); // 还原矩阵
    this.deepGraph.refresh();
  }

  downloadImageNew = () => {
    const matrixStash = this.graph.getMatrix(); // 缓存当前矩阵
    console.log('this.deepGraph--->', this.deepGraph);
    // const copyGraph = Object.assign({}, this.graph);

    html2canvas(this.deepGraph.get('graphContainer')).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const saveName = 'graph.png';
      link.download = saveName;
      link.href = dataURL.replace('image/png', 'image/octet-stream');
      link.click();
      this.deepGraph.updateMatrix(matrixStash); // 还原矩阵
      this.deepGraph.refresh();
    });
  }

  render() {
    const g6Wrapper = {
      width: 800,
      border: '1px solid #999',
    }
    const hideWrapper = {
      display: 'none'
    }
    return (
      <div>
        <button onClick={this.downloadCurrentImage}>下载</button>
        <div id={this.graphId} style={g6Wrapper}></div>
        <div id={this.deepGraphId} style={hideWrapper}></div>
      </div>
    )
  };
};

export default Chart;
