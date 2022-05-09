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
  }

  convertLogDataToChartData() {
    console.log("*** Start converting LogData To ChartData ***")

    // convert csv to json
    const papa = Papa.parse(this.props.logData, {header: true, dynamicTyping: true, skipEmptyLines: true});

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

    // calculate the mean utilization per hour per node
    const mean_utilization_per_hour_per_node = _.fromPairs(
      _.map(records_per_node, (records, node) => {
        try {
          // console.log("record.timestamp", records)
          const records_per_hour = _.groupBy(records, record => moment(record.timestamp, 'YYYY/MM/DD HH:mm:ss.SSS').startOf('hour'));
          const mean_utilization_per_hour = _.fromPairs(_.map(records_per_hour, (records, start) => [start, _.meanBy(records, record => record.utilization)]))

          return [node, mean_utilization_per_hour];
        } catch (e) {
          console.log("e", e)
        }

      }));

    const options = function (node) {
      if (node === 'cluster') {
        return {
          borderColor: '#df1995',
          backgroundColor: '#df1995',
          borderWidth: 8,
        }
      }

      return {
        borderColor: color(node),
        borderDash: [5, 5],
      }
    }

    const datasets = _.map(mean_utilization_per_hour_per_node, (mean_utilization_per_hour, node) => {
      return {
        label: node,
        data: _.map(mean_utilization_per_hour, (mean_utilization, hour) => {
          return {
            x: hour,
            y: mean_utilization,
          }
        }),
        ...options(node),
      }
    });

    this.setState({data: {datasets: datasets}, status: STATUS.Ready});
  }

  componentDidMount() {
    if (this.state.status === null) {
      this.setState(
        {status: STATUS.Loading},
        () => setTimeout(this.convertLogDataToChartData.bind(this) , 10)
      )
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
