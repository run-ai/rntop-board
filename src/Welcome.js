import React from 'react'

import Upload from './Upload'

class Welcome extends React.Component {
  render() {
    return (
      <div>
        <h1>
          Welcome to rntop Board
        </h1>
        <p>
          Run <a href="https://github.com/run-ai/rntop">rntop</a> and save an output file.
          Then upload it here to see it visualized.
        </p>
        <Upload onRead={this.props.onRead} />
      </div>
    )
  }
}

export default Welcome;
