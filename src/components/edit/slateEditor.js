import React from 'react';
import { Editor } from 'slate-react';
import MarkdownPlugin from 'slate-markdown';
class SlateEditor extends React.Component {
  constructor(props) {
    super(props);
    const markdown = MarkdownPlugin();
    this.state = {
      state: null,
      plugins: [markdown],
    };
  }
  onChange = state => {
    this.setState({
      state,
    });
  };
  render() {
    const { state, plugins } = this.state;
    return (
      <div>
        <Editor
          plugins={plugins}
          autoFocus
         />
      </div>
    );
  }
};
export default SlateEditor;
