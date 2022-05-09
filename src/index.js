import React from "react";
import ReactDOM from "react-dom/client";
import Welcome from './WelcomeComponent/Welcome';
import Dashboard from './DashboardComponent/Dashboard';
import './index.css';

const STEPS = {
  Welcome: "Welcome",
  Dashboard: "Dashboard",
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logData: null, step: STEPS.Welcome };
  }

  onRead = (logData) => {
    this.setState({ logData, step: STEPS.Dashboard})
  }

  render() {
    return (
      <div className="indexComponent">
        {
          (() => {
            switch (this.state.step) {
              case STEPS.Welcome:
                console.log("** Welcome **")
                return <Welcome onRead={this.onRead}/>
              case STEPS.Dashboard:
                console.log("** Dashboard **")
                return <Dashboard logData={this.state.logData}/>
              default:
                return <div> ... </div>;
            }
          })()

        }
      </div>
    )
  }
}

const rootElement = document.getElementById("app");
const root = ReactDOM.createRoot(rootElement);


root.render(
    <App />
);