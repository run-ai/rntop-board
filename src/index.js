import React from 'react'
import ReactDOM from 'react-dom'

import Welcome from './Welcome';
import Dashboard from './Dashboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: null };
  }

  onRead = (text) => {
    this.setState({ text: text })
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {!this.state.text ? <Welcome onRead={this.onRead} /> : <Dashboard text={this.state.text} />}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
