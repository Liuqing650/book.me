import React from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import styles from './index.less';
class Editor extends React.Component {
  state = {
    content: null,
    htmlContent: null
  }
  handleChange = (content) => {
    this.setState({ content });
  }
  handleHTMLChange = (htmlContent) => {
    this.setState({ htmlContent });
  }
  render () {
    const heightDoc = document.scrollingElement.clientHeight;
    const editorProps = {
      viewWrapper: '.bookEditor',
      height: Math.round(heightDoc - 500 - 72 -1),
      initialContent: this.state.content,
      onChange: this.handleChange,
      onHTMLChange: this.handleHTMLChange,
      controls: [
        'undo', 'redo', 'split', 'font-size', 'font-family', 'text-color',
        'bold', 'italic', 'underline', 'strike-through', 'superscript',
        'subscript', 'emoji', 'text-align', 'split', 'headings', 'list_ul', 'list_ol',
        'blockquote', 'code', 'split', 'link', 'split'
      ],
      extendControls: [
        {
          type: 'button',
          text: '预览',
          className: 'preview-button',
          onClick: () => {
            window.open().document.write(this.state.htmlContent)
          }
        },
        {
          type: 'split',
        },
        {
          type: 'button',
          text: '保存数据',
          className: 'save-button',
          onClick: () => {
            const lineData = this.props.lineData;
            lineData[3].content = this.state.htmlContent;
            this.props.onChangeValue({lineData: lineData});
          }
        },
      ]
    }
    return (
      <div className={`bookEditor ${styles.bookBraftEditor}`}>
        <BraftEditor {...editorProps}/>
      </div>
    )
  }
}
export default Editor;
