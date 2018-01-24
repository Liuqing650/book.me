import React from 'react';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import styles from './index.less';

class Editor extends React.Component {
  handleChange = (content) => {
    this.props.onChange(content);
  }
  render () {
    const heightDoc = document.scrollingElement.clientHeight;
    const { content } = this.props;
    const colors = ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'];
    const editStyle = {
      height: Math.round(heightDoc - 500 - 72 - 1),
      border: '0',
    };
    const editorProps = {
      theme: 'snow',
      style: editStyle,
      placeholder: '填写一份临时笔记吧！',
      modules: {
        toolbar: [
          [{ 'font': [] }],
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['clean'],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          ['blockquote', 'code-block'],
          [{ 'color': colors }, { 'background': colors }],
          ['link', 'image', 'video'],
          ['clean']
        ],
      },
      formats: [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
        'list', 'bullet', 'indent', 'align', 'direction',
        'link', 'image', 'video', 'color', 'script', 'font', 'background'
      ],
      value: content,
      onChange: this.handleChange
    }
    return (
      <div className={`bookEditor`}>
        <ReactQuill {...editorProps}/>
      </div>
    )
  }
}
export default Editor;
