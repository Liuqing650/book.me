import React, { Component, PropTypes } from 'react';
import G6 from '@antv/g6';
import html2canvas from 'html2canvas';
import Button from 'components/lib/button';
const Global = G6.Global;
const Util = G6.Util;
function generateUniqueId(isDeep) {
  return isDeep ? `rc-g6-1` : `rc-g6-0`;
}
Global.nodeStyle = {
  stroke: '#666',
  fill: '#fff',
  lineWidth: 1,
  radius: 4,
  fillOpacity: 0.10
};
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
    };
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
      lineWidth: 1,
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
    graph.edge().shape('smooth');
    graph.edge().label((data) => {
      const allData = [this.graph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      return node.name;
    });
    graph.edge().tooltip((data) => {
      const allData = [this.graph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      return [['路径标识', node.name]];
    });
    graph.node().tooltip((obj) => {
      return [
        ['简要信息', obj.name]
      ];
    });
    graph.source(this.props.data);
    this.graph = graph;
    this.graph.render();

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
      height: 1000
    });
    this.deepGraphContainer = deepGraph.get('graphContainer');
    deepGraph.node().label('name').style(this.nodeStyle);
    deepGraph.edge().shape('smooth');
    deepGraph.edge().label((data) => {
      const allData = [this.deepGraph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      // console.log('node--->', node)
      return node.name;
    });
    deepGraph.edge().color((data) => {
      const allData = [this.deepGraph.save().source];
      const node = this.findNodeDataById(allData, data.target);
      return node.name.indexOf('an') > -1 ? '#FF0' : '#222';
    });
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
      // this.downloadImageNew();
      this.drawImageUpdate();
    }, 1000);
  };

  drawImageUpdate = () => {
    const canvasArr = this.deepGraph.get('graphContainer').getElementsByTagName('canvas');
    canvasArr[0].getContext('2d').drawImage(canvasArr[1], 0, 0);
    const dataURL = canvasArr[0].toDataURL('image/jpeg');
    const link = document.createElement('a');
    const saveName = 'graph.jpeg';
    link.download = saveName;
    link.href = dataURL.replace('image/jpeg', 'image/octet-stream');
    link.click();

    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');
    // 获取数组
    // const data = <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><foreignObject width="100%" height="100%">{this.graphContainer}</foreignObject></svg>;
    // const DOMURL = window.URL || window.webkitURL || window;
    // const img = new Image();
    // const svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    // const url = DOMURL.createObjectURL(svg);
    // img.onload = () => {
    //   ctx.drawImage(img, 0, 0);
    //   DOMURL.revokeObjectURL(url);
    // };
    // const blobToDataURL = (blob, callback) => {
    //   console.log('blob---->', blob);
    //   const file = new FileReader();
    //   file.onload = (even) => callback(even.target.result);
    //   file.readAsDataURL(blob);
    // };
    // const changeStata = (base) => {
    //   this.setState({
    //     url: base
    //   });
    // };
    // changeStata(url);
    // blobToDataURL(url, (base) => {
    //   changeStata(base);
    // });
  }

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

  downloadImage = () => {
    const matrixStash = this.graph.getMatrix(); // 缓存当前矩阵
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

  render() {
    const g6Wrapper = {
      border: '1px solid #999',
    };
    const hideWrapper = {
      display: 'none'
    };
    return (
      <div>
        <Button onClick={this.downloadCurrentImage}>下载</Button>
        <div id={this.graphId} style={g6Wrapper}></div>
        <div id={this.deepGraphId} style={hideWrapper}></div>
      </div>
    );
  }
}
export default TreeChart;
