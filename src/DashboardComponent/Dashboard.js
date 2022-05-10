import Papa from 'papaparse'
import React from 'react'
import _ from 'lodash';
import moment from 'moment';
import 'chartjs-adapter-moment';
import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import { color, chartOptions } from './utils'
import Loading from "react-simple-loading";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

const worker = new Worker(new URL('./worker.js', import.meta.url));

worker.onerror = (err) => {
  console.log("onerror", err);
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend
);


const STATUS = {
  Loading: "Loading",
  Ready: "Ready",
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: null, status: null}
    worker.onmessage = (answer) => {
      console.log("onmessage", answer);
      this.setState({data: {datasets: answer.data}, status: STATUS.Ready})//.bind(this);
    }
  };

  componentDidMount() {
    if (this.state.status === null) {
      console.log("** worker.postMessage **")
      worker.postMessage(JSON.stringify(this.props.logData));
      this.setState({status: STATUS.Loading})
    }
  }

  render() {

    if (this.state.status === STATUS.Ready) {
      return <Line options={chartOptions} data={this.state.data} />
    }
    return <h1>
      <Loading />
      <div>
        Loading...
      </div>
    </h1>

  }
}

export default Dashboard;
