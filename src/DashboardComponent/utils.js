const COLORS = [
  '#f9c938',
  '#3dd279',
  '#0554fd',
  '#fb7749',
  '#00263e',
  '#df1995',
];

export function color(dataset) {
  if (!(dataset in color.datasets)) {
    color.datasets[dataset] = COLORS[color.index++ % COLORS.length];
  }

  return color.datasets[dataset];
}

color.datasets = {}
color.index = 0



export const chartOptions = {
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