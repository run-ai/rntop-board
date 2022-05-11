import React from 'react'
import 'chartjs-adapter-moment';

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
import { Line } from 'react-chartjs-2';

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

const options = {
  responsive: true,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
          displayFormats: {
            hour: 'MM-DD-YYYY HH:mm',
          }
        },
    title: {
        display: true,
        text: 'Time'
      },
    },
    y: {
      min: 0,
      max: 100,
      title: {
        display: true,
        text: 'GPU utilization (%)'
      }
    }
  },
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: null }
    this.worker = new Worker(new URL('./worker.js', import.meta.url));
    this.worker.onerror = (err) => {
      console.error(err);
    }
    this.worker.onmessage = (answer) => {
      this.setState({ data: { datasets: answer.data } })
    }
  }

  componentDidMount() {
    this.worker.postMessage({ text: this.props.text, configuration: this.props.configuration });
  }

  render() {
    if (this.state.data) {
      return <Line options={options} data={this.state.data} />
    }

    return (
      <div>
        <h1>Loading...</h1>
        <p>This could take up to a few minutes.</p>
      </div>
    )
  }
}

export default Dashboard;
