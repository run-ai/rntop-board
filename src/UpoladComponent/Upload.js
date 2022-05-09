import React from 'react';
import './Upload.css';

class Upload extends React.Component {
  onChange = e => {
    e.preventDefault();

    const reader = new FileReader();

    reader.onerror = function() {
      console.error(reader.error);
    };

    reader.onload = (e) => {
      this.props.onRead(e.target.result)
    };

    reader.readAsText(e.target.files[0]);
  };

  render() {
    return <input type="file" id="upload" onChange={this.onChange} />
  }
}

export default Upload;
