import React, { Component, PropTypes } from 'react';
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

G6.registerEdge('treeEdge', {
  draw(cfg, group) {
    if (cfg.label) {
      console.log('text------>', cfg.label.text);
      console.log(cfg.points[0], cfg.points[1]);
      const node = {
        x: (cfg.points[0].x + cfg.points[1].x) / 2,
        y: (cfg.points[0].y + cfg.points[1].y) / 2
      };
      // const handlePosition = (points) => {
      //   const one = points[0];
      //   const two = points[1];
        // if (one) {

        // }
      // };
      console.log('node------>', node);
      console.log('<------------------------------------->');
      // handlePosition(cfg.label.layer);
      group.addShape('text', {
        attrs: {
          x: node.x,
          y: node.y,
          fill: 'green',
          lineWidth: 100,
          text: cfg.label.text,
          textAlign: 'center',
          textBaseline: 'top'
        }
      });
    }
    return group.addShape('polyline', {
      attrs: {
        points: [
          [cfg.points[0].x, cfg.points[0].y],
          [cfg.points[1].x, cfg.points[1].y]
        ],
        stroke: '#222',
        lineWidth: cfg.size
      }
    });
  }
});
class TreeChart extends Component {
  static propTypes = {
    data: PropTypes.object,
    height: PropTypes.number,
    fitViewPadding: PropTypes.number,
    layoutCfg: PropTypes.object,
    grid: PropTypes.object,
    saveData: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      node: {},
      isSave: false, // 存储状态
      isRead: false, // 阅读模式
      url: '',
      ratio: 1,
    };
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
      lineWidth: 1,
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
      // plugins: [ miniMap ],
      ...props
    });
    graph.tooltip(true);
    this.graphContainer = graph.get('graphContainer');
    graph.addBehaviour('default', ['clickBlankClearActive']);
    graph.node().label('treename').style(this.nodeStyle);
    // graph.edge().shape('smooth');
    graph.edge().shape('treeEdge');
    graph.edge().label((data) => {
      const allData = [this.graph.save().source];
      // const parent = this.findNodeDataById(allData, data.source);
      const node = this.findNodeDataById(allData, data.target);
      // console.log('node--->', node);
      const text = node.treeInfo ? node.treeInfo.text : '';
      if (text) {
        return {
          text: text,
          layer: node.layer,
          fill: 'green',
          textAlign: 'left',
          translate: [node.x - 100, node.y]
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
    deepGraph.node().label('treename').style(this.nodeStyle);
    // deepGraph.edge().shape('smooth');
    deepGraph.edge().label((data) => {
      const allData = [this.deepGraph.save().source];
      // const parent = this.findNodeDataById(allData, data.source);
      const node = this.findNodeDataById(allData, data.target);
      const text = node.treeInfo ? node.treeInfo.text : '';
      return {
        text: text,
        // lineWidth: node.treename.length * 2,
        fill: 'green',
        textAlign: 'left'
        // rotate: this.angle(parent, node)
      };
    }).style({
      lineWidth: 5,
      stroke: 'green'
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
    );
  }
}
export default TreeChart;
