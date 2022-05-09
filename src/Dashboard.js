import Papa from 'papaparse'
import React from 'react'
import _ from 'lodash';
import moment from 'moment';
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

import { color } from './utils'

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

export const options = {
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

function startTime(record, hours) {
  // parse the record timestamp
  let time = moment(record.timestamp, 'YYYY/MM/DD HH:mm:ss.SSS');

  // round to the last hour
  time = time.startOf('hour')

  // round to the last _hours_ hours
  time = time.hours(Math.floor(time.hours() / hours) * hours)

  // and we're done
  return time;
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: null }
  }

  componentDidMount() {
    // convert csv to json
    const papa = Papa.parse(this.props.text, { header: true, dynamicTyping: true, skipEmptyLines: true });

    // find indexes of rows with errors
    const rows = _.map(papa.errors, o => o.row)

    // replace any row with an error with 'undefined'
    _.forEach(rows, row => papa.data[row] = undefined)

    // filter all rows w/o errors
    const data = _.without(papa.data, undefined)

    // group entries by node
    const records_per_node = _.groupBy(data, record => record.node);

    // keep the whole cluster data as well
    records_per_node['cluster'] = data;

    // calculate the mean utilization per node per x hours
    const mean_utilization_per_node_per_x_hours =
      _.fromPairs(
      _.map(records_per_node, (records, node) => {
        const records_per_x_hours = _.groupBy(records, record => startTime(record, 4));
        const mean_utilization_per_x_hours = _.fromPairs(_.map(records_per_x_hours, (records, start) => [start, _.meanBy(records, record => record.utilization)]))

        return [node, mean_utilization_per_x_hours];
      }));

    const options = function(node) {
      if (node === 'cluster') {
        return {
          borderColor: '#df1995',
          backgroundColor: '#df1995',
          borderWidth: 8,
        }
      }

      return {
        borderColor: color(node),
        borderDash: [5,5],
      }
    }

    const datasets = _.map(mean_utilization_per_node_per_x_hours, (mean_utilization_per_x_hours, node) => {
        return {
          label: node,
          data: _.map(mean_utilization_per_x_hours, (mean_utilization, hour) => {
            return {
              x: hour,
              y: mean_utilization,
            }
          }),
          ...options(node),
        }
      });

    this.setState({ data: { datasets: datasets } });
  }

  render() {
    if (this.state.data) {
      return <Line options={options} data={this.state.data} />
    }

    return <h1>Loading...</h1>
  }
}

export default Dashboard;
