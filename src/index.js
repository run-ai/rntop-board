import React from 'react'
import ReactDOM from 'react-dom'

import Welcome from './Welcome';
import Dashboard from './Dashboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uploaded: false, text: null, configuration: null };
  }

  onUpload = ({ text, configuration }) => {
    this.setState({ uploaded: true, text: text, configuration: configuration })
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {!this.state.uploaded ? <Welcome onUpload={this.onUpload} /> : <Dashboard text={this.state.text} configuration={this.state.configuration} />}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
