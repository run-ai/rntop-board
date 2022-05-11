import React from 'react';

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

  onClick() {
    document.getElementById('file').click()
  }

  render() {
    return (
      <>
        <input type="file" id="file" style={{display: "none"}} onChange={this.onChange} />
        <input type="button" value="Upload" onClick={this.onClick} />
      </>
    )
  }
}

export default Upload;
