import React from 'react';
// import CheckListItem from './checkList';
class SlateEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  onChange = (state) => {
    this.setState({
      state,
    });
  };
  render() {
    const { value } = this.state;
    return (
      <div>
        {/* <CheckListItem /> */}
      </div>
    );
  }
};
export default SlateEditor;
