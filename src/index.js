import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import _ from 'lodash';
import moment from 'moment';

const COLORS = [
  '#df1995',
  '#f9c938',
  '#3dd279',
  '#0554fd',
  '#fb7749',
  '#00263e',
];

function color(dataset) {
  if (!(dataset in color.datasets)) {
    color.datasets[dataset] = COLORS[color.index++ % COLORS.length];
  }

  return color.datasets[dataset];
}

color.datasets = {}
color.index = 0

document.getElementById("load").addEventListener("click", function() {
  var file = document.getElementById("upload").files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onerror = function() {
      console.log(reader.error);
    };
    reader.onload = function (event) {
      // convert csv to json
      const papa = Papa.parse(event.target.result, { header: true, dynamicTyping: true, skipEmptyLines: true });

      // find numbers of rows with errors
      const rows = _.map(papa.errors, o => o.row)

      // replace any row with an error with 'undefined'
      _.forEach(rows, row => papa.data[row] = undefined)

      // filter all rows w/o errors
      const data = _.without(papa.data, undefined)

      const records_per_node = _.groupBy(data, record => record.node); // add "+ ':' + record.index" to group by per GPU

      const mean_utilization_per_hour_per_node =
            _.fromPairs(
            _.map(records_per_node, (records, node) => {
              const records_per_hour = _.groupBy(records, record => moment(record.timestamp, 'YYYY/MM/DD HH:mm:ss.SSS').startOf('hour'));
              const mean_utilization_per_hour = _.fromPairs(_.map(records_per_hour, (records, start) => [start, _.meanBy(records, record => record.utilization)]))

              return [node, mean_utilization_per_hour];
            }));

      const datasets = _.map(mean_utilization_per_hour_per_node, (mean_utilization_per_hour, node) => {
        return {
          label: node,
          data: _.map(mean_utilization_per_hour, (mean_utilization, hour) => {
            return {
              x: hour,
              y: mean_utilization,
            }
          }),
          borderColor: color(node),
          backgroundColor: color(node),
        }
      });

      const chart = new Chart(document.getElementById('chart').getContext('2d'), {
          type: 'line',
          data: {
            datasets,
          },
          options: {
            scales: {
              x: {
                type: 'time',
                title: {
                  display: true,
                  text: 'Date'
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
            }
          }
        });

        document.getElementById("upload").remove();
        document.getElementById("load").remove();
      }
  }
})
