import React, { Component } from 'react';
import G6 from '@antv/g6';
import SideTool from './tool';
import styles from './index.less';
const Global = G6.Global;
function generateUniqueId(isDeep) {
  return isDeep ? `rc-g6-1` : `rc-g6-0`;
}
Global.nodeStyle = {
  stroke: '#222',
  fill: '#fff',
  lineWidth: 1,
  radius: 0,
  fillOpacity: 0.10
};
G6.registerNode('treeNode', {
  draw(cfg, group) {
    const model = cfg.model;
    const width = `${model.treename}`.length * 18;
    return group.addShape('rect', {
      attrs: {
        x: 110,
        y: 130,
        zIndex: 10,
        width: width > 100 ? width : 100,
        fill: !model.circle ? '#42a5f5' : '#ffc53d',
        height: !model.circle ? 30 : 50,
        stroke: !model.circle ? '#42a5f5' : '#ffc53d'
      }
    });
    // return group.addShape('circle', {
    //   attrs: {
    //     x: 120,
    //     y: 90,
    //     r: 50,
    //     zIndex: 10,
    //     stroke: '#000'
    //   }
    // });
  },
  afterDraw(cfg, group, keyShape){
    const model = cfg.model;
    const points = {
      x: model.circle ? cfg.x + 135 : cfg.x + 150,
      y: model.circle ? cfg.y + 160 : cfg.y + 150,
    };
    group.addShape('text', {
      attrs: {
        x: points.x,
        y: points.y,
        fill: !model.circle ? '#FFF' : '#222',
        text: model.treename
      }
    });
  },
});
G6.registerEdge('treeEdge', {
  draw(cfg, group) {
    return group.addShape('polyline', {
      attrs: {
        points: [
          [cfg.points[0].x, cfg.points[0].y],
          [cfg.points[1].x, cfg.points[1].y]
        ],
        zIndex: -1,
        stroke: '#222',
        lineWidth: 1
      }
    });
  },
  afterDraw(cfg, group, keyShape){
    if (cfg.label) {
      const isFr = cfg.label.isFr;
      const node = {
        x: (cfg.points[0].x + cfg.points[1].x) / 2 - 30,
        y: (cfg.points[0].y + cfg.points[1].y) / 2
      };
      if (!isFr) {
        node.y -= 20;
      }
      group.addShape('rect', {
        attrs: {
          x: node.x - 10,
          y: node.y - 5,
          width: 100,
          height: cfg.label.isFr ? 26 : 50,
          stroke: 'black',
          fill: '#FFF'
        }
      });
      group.addShape('text', {
        attrs: {
          x: node.x,
          y: node.y,
          fill: 'green',
          lineWidth: 100,
          text: cfg.label.text,
          textAlign: 'left',
          textBaseline: 'top'
        }
      });
    }
  },
});
class Chart extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      node: {},
      isSave: false, // 存储状态
      isRead: false, // 阅读模式
      url: '',
      ratio: 1,
    }
    // id生成函数
    this.graphId = generateUniqueId();
    this.graph = null;
    this.graphContainer = null;
    this.deepGraphId = generateUniqueId(true);
    this.deepGraph = null; // 用作下载
    this.deepGraphContainer = null;

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
  
  componentDidUpdate(newProps) {
    if (newProps !== this.props) {
      this.graph.destroy();
      this.initTree(this.props);
    }
  }
  // 跳转页面
  onNodeClick = (node) => {
    console.log(node);
  }

  // 初始化Tree
  initTree(props) {
    const graph = new G6.Tree({
      id: this.graphId,
      fitView: {
        x: 0,
        y: 0
      },
      ...props
    });
    graph.tooltip(true);
    this.graphContainer = graph.get('graphContainer');
    graph.addBehaviour('default', ['clickBlankClearActive']);
    graph.node().shape('treeNode');
    graph.node().label((data) => {
      return {
        text: data.treename,
        nodeInfo: data,
      };
    }).style(this.nodeStyle);
    // graph.edge().shape('smooth');
    graph.edge().shape('treeEdge');
    graph.edge().label((data) => {
      const allData = [this.graph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      const text = node.treeInfo ? node.treeInfo.text : '';
      if (text) {
        return {
          text: text,
          layer: node.layer, // 自定义属性 位于第几层（unuse）
          isFr: node.treeInfo.isFr, // 自定义属性 判断是否是法人
          fill: 'green',
          textAlign: 'left'
          // rotate: this.angle(parent, node)
        };
      }
    }).style({
      lineWidth: 1,
      stroke: '#222'
    });
    graph.edge().tooltip((data) => {
      const allData = [this.graph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      return [['路径标识', node.treename]];
    });
    graph.node().tooltip((obj) => {
      return [
        ['简要信息', obj.treename]
      ];
    });
    graph.source(this.props.data);
    this.graph = graph;
    this.graph.render();
    this.graph.on('click', this.onNodeClick);
  }
  createDeepTree = (props) => {
    const deepGraph = new G6.Tree({
      id: this.deepGraphId,
      fitView: {
        x: 0,
        y: 0
      },
      ...props,
      height: 1000
    });
    this.deepGraphContainer = deepGraph.get('graphContainer');
    deepGraph.node().shape('treeNode');
    deepGraph.node().label((data) => {
      return {
        text: data.treename,
        nodeInfo: data,
      };
    }).style(this.nodeStyle);
    // deepGraph.edge().shape('smooth');
    deepGraph.edge().shape('treeEdge');

    deepGraph.edge().label((data) => {
      const allData = [this.deepGraph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      const text = node.treeInfo ? node.treeInfo.text : '';
      if (text) {
        return {
          text: text,
          layer: node.layer, // 自定义属性 位于第几层（unuse）
          isFr: node.treeInfo.isFr, // 自定义属性 判断是否是法人
          fill: 'green',
          textAlign: 'left'
          // rotate: this.angle(parent, node)
        };
      }
    }).style({
      lineWidth: 1,
      stroke: '#222'
    });
    deepGraph.edge().color((data) => {
      const allData = [this.deepGraph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      return [['路径标识', node.treename]];
    });
    deepGraph.source(this.props.data);
    this.deepGraph = deepGraph;
    this.deepGraph.render();
  }
  // 图片下载按钮事件
  download = () => {
    this.createDeepTree(this.props);
    this.graph.autoZoom(); // 缩放到适应大小
    this.deepGraph.autoSize();
    setTimeout(() => {
      this.downloadImage();
    }, 1000);
  };
  // 下载图片
  downloadImage = () => {
    const canvasArr = this.deepGraph.get('graphContainer').getElementsByTagName('canvas');
    canvasArr[0].getContext('2d').drawImage(canvasArr[1], 0, 0);
    const dataURL = canvasArr[0].toDataURL('image/jpeg');
    const link = document.createElement('a');
    const saveName = 'graph.jpeg';
    link.download = saveName;
    link.href = dataURL.replace('image/jpeg', 'image/octet-stream');
    link.click();
  }
  /**
   * 缩放图形
   * ratio 缩放比例
   * zoom 放大|缩小
   */
  focus = (ratio, zoom) => {
    let scale = ratio;
    if (scale < 0) {
      scale = 0;
    }
    if (scale > 10) {
      scale = 10;
    }
    if (zoom === 'add' && scale > 0 && scale < 10) {
      scale = Math.round(parseFloat(scale + 1) * 100) / 100;
    }
    if (zoom === 'sub' && scale < 10 && scale > 0 ) {
      scale = Math.round(parseFloat(scale - 1) * 100) / 100;
    }
    this.zoom(scale);
    this.setState({
      ratio: scale
    });
  }
  zoom = (ratio) => {
    const matrix = new G6.Matrix.Matrix3();
    matrix.scale(ratio, ratio);
    matrix.translate(480, 300);
    this.graph.updateMatrix(matrix);
    this.graph.refresh();
  }
  /**
   * 工具区
   * 1. 根据id查找节点 findNodeDataById
   * 2. 获取角度 angle
   */

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
        });
      }
    };
    loop(nodeData);
    return output;
  };
  angle = (start, end) => {
    const diffX = end.x - start.x;
    const diffY = end.y - start.y;
    return 360 * Math.atan(diffY / diffX) / (2 * Math.PI);
  }

  render() {
    const self = this;
    const { ratio } = this.state;
    const sideToolProps = {
      scale: Math.round(ratio * 10),
      onClick(even) {
        switch (even) {
          case 'download':
            self.download();
            break;
          case 'add':
            self.focus(ratio, 'add');
            break;
          case 'sub':
            self.focus(ratio, 'sub');
            break;
          default:
            break;
        }
      }
    };
    return (
      <div>
        <SideTool {...sideToolProps} />
        <div id={this.graphId} className={styles.chartWrap}></div>
        <div id={this.deepGraphId} style={{ display: 'none'}}></div>
      </div>
    )
  };
};

export default Chart;
