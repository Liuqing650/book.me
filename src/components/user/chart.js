import React, { Component } from 'react';
import G6 from '@antv/g6';
import Plugins from '@antv/g6-plugins';
import html2canvas from 'html2canvas';
console.log('html2canvas--->', html2canvas);
const miniMap = new Plugins['tool.minimap']();
let Global = G6.Global;
let Util = G6.Util;
function generateUniqueId() {
  return `rc-g6-0`;
}
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
    this.input = this.createInput();

    this.mouseEnterNodeStyle = {
			lineWidth: 2,
            stroke: '#108ee9',
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
      plugins: [ miniMap ],
      ...props
    });
    graph.tooltip(true);
    this.graphContainer = graph.get('graphContainer');
    this.graphContainer.appendChild(this.input);
    graph.addBehaviour('default', ['clickActive', 'clickBlankClearActive']);
    graph.node().label('name').style(this.nodeStyle);
    graph.edge().shape('smooth');
    graph.edge().label((data) => {
      // console.log(data)
       return data.source;
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

  createInput = () => {
    const input = Util.createDOM('<input class="g6-label-input" />', {
      position: 'absolute',
      zIndex: 10,
      display: 'none'
    });
    return input;
  }
  downloadCurrentImage = () => {
    this.downloadImage();
  };
  
  downloadImage = (bool) => {
    const matrixStash = this.graph.getMatrix(); // 缓存当前矩阵
    if (!bool) {
      this.graph.autoZoom(); // 图自动缩放以适应画布尺寸
    }
    html2canvas(this.graphContainer).then((canvas) => {
      console.log('canvas-->', canvas);
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
    }
    return (
      <div>
        <button onClick={this.downloadCurrentImage}>下载</button>
        <div id={this.graphId} style={g6Wrapper}></div> 
      </div>
    )
  };
};

export default Chart;
