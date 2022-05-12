import Papa from 'papaparse'
import _ from 'lodash';
import moment from 'moment';
import { color } from './utils'

function convertCSVtoJSON(csv) {
  // convert csv to json
  const papa = Papa.parse(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });

  // find indexes of rows with errors
  const rows = _.map(papa.errors, o => o.row)

  // replace any row with an error with 'undefined'
  _.forEach(rows, row => papa.data[row] = undefined)

  // filter all rows w/o errors
  return _.without(papa.data, undefined)
}

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

function recordsPerNodePerXHours(records_per_node, hours) {
  return _.fromPairs(_.map(records_per_node, (records, node) => [node, _.groupBy(records, record => startTime(record, hours))]))
}

function meanUtilizationPerXHours(records_per_x_hours) {
  return _.fromPairs(_.map(records_per_x_hours, (records, start) => [start, _.meanBy(records, record => record.utilization)]))
}

function meanUtilizationPerNodePerXHours(records_per_node_per_x_hours) {
  return _.fromPairs(_.map(records_per_node_per_x_hours, (records_per_x_hours, node) => [node, meanUtilizationPerXHours(records_per_x_hours)]))
}

function options(node) {
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

self.onmessage = (e) => {
  // convert the csv to json
  const data = convertCSVtoJSON(e.data.text)

  // group entries by node
  const records_per_node = _.groupBy(data, record => record.node);

  // keep the whole cluster data as well
  records_per_node['cluster'] = data;

  // calculate the mean utilization per node per x hours
  const records_per_node_per_x_hours = recordsPerNodePerXHours(records_per_node, e.data.configuration.hours);
  const mean_utilization_per_node_per_x_hours = meanUtilizationPerNodePerXHours(records_per_node_per_x_hours);

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

  const info = { utilization: _.meanBy(data, record => record.utilization) }

  self.postMessage({ datasets, info });
}
