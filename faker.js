#!/usr/bin/env node

const _ = require('lodash')
const fs = require('fs')
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser({
    description: 'Fake data generator for Board for rntop'
});

parser.add_argument('-o', '--output', { default: 'rntop.log', help: 'Output file' });
parser.add_argument('--interval', { type: 'int', default: 30, help: 'Interval in seconds between cluster samples' });
parser.add_argument('--hours', { type: 'int', default: 24 * 5, help: 'Duration of log in hours' });
parser.add_argument('--nodes', { type: 'int', default: 5, help: 'Number of nodes in the cluster' });

const args = parser.parse_args();

var nodes = []
for (let i = 0; i < args.nodes; i++) {
    nodes.push({
        name: 'server-' + i.toString(),
        devices: _.sample([1, 2, 4, 8, 16]),
        utilization: _.random(1, 20) * 5,
    })
}

var output = fs.createWriteStream(args.output)
output.write('timestamp,node,index,utilization,memory_used,memory_total\n')

let time = new Date();
time.setHours(time.getHours() - args.hours)

while (time <= new Date()) {
    const timestamp = time.toISOString()

    for (const node of nodes) {
        for (let device = 0; device < node.devices; device++) {
            const utilization = _.random(Math.max(node.utilization - 20, 0), Math.min(node.utilization + 20, 100))
            const memory_used = 0
            const memory_total = 0

            output.write(timestamp + ',' + node.name + ',' + device.toString() + ',' + utilization.toString() + ',' + memory_used.toString() + ',' + memory_total.toString() + '\n')
        }
    }

    time.setSeconds(time.getSeconds() + args.interval)
}
