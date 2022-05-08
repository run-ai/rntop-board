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
