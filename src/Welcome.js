import React from 'react'

import Upload from './Upload'

class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = { configure: false, hours: 2 }
  }

  onConfigure() {
    this.setState({ configure: true })
  }

  onHours(e) {
    if (!e.target.validity.valid) {
      return
    }

    let value = parseInt(e.target.value)

    if (value < 1 || value > 24) {
      return
    }

    if (Number.isNaN(value)) {
      value = ''
    }

    this.setState({ hours: value })
  }

  onRead(text) {
    this.props.onUpload({ text: text, configuration: { hours: this.state.hours }})
  }

  render() {
    let configuration;
    if (this.state.configure) {
      configuration = (
        <>
          <h4>Configuration:</h4>
          Hours: <input style={{width: "30px"}} type="text" pattern="[0-9]*" onInput={this.onHours.bind(this)} value={this.state.hours} />
        </>
      )
    } else {
      configuration = <button onClick={this.onConfigure.bind(this)}>Configure</button>
    }

    return (
      <div>
        <h1>
          Welcome to rntop Board
        </h1>
        <p>
          Run <a href="https://github.com/run-ai/rntop">rntop</a> and save an output file.
          Then upload it here to see it visualized.
        </p>
        <div style={{margin: "10px"}}>
          {configuration}
        </div>
        <Upload onRead={this.onRead.bind(this)} />
      </div>
    )
  }
}

export default Welcome;
