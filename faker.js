#!/usr/bin/env node

const _ = require('lodash')
const fs = require('fs')
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser({
    description: 'Fake data generator for Board for rntop'
});

parser.add_argument('-o', '--output', { default: 'rntop.log', help: 'Output file' });
parser.add_argument('--interval', { type: 'int', default: 30, help: 'Interval in seconds between cluster samples' });
parser.add_argument('--days', { type: 'int', default: 0, help: 'Duration of log in days' });
parser.add_argument('--hours', { type: 'int', default: 0, help: 'Duration of log in hours in addition to days' });
parser.add_argument('--nodes', { type: 'int', default: 5, help: 'Number of nodes in the cluster' });
parser.add_argument('--devices', { type: 'int', default: -1, help: 'Number of GPUs per node' });
parser.add_argument('-r', '--randomness', { type: 'int', default: 10, help: 'Number of intervals to slightly change the mean node utilization' });

const args = parser.parse_args();

var nodes = []
for (let i = 0; i < args.nodes; i++) {
    nodes.push({
        name: 'server-' + i.toString(),
        devices: args.devices != -1 ? args.devices : _.sample([1, 2, 4, 8, 16]),
        utilization: _.random(1, 20) * 5,
    })
}

var output = fs.createWriteStream(args.output)
output.write('timestamp,node,index,utilization,memory_used,memory_total\n')

const hours = (args.days || args.hours) ? (args.days * 24 + args.hours) : 5 * 24

let time = new Date();
time.setHours(time.getHours() - hours)

let counter = 0
while (time <= new Date()) {
    const timestamp = time.toISOString()

    for (const node of nodes) {
        for (let device = 0; device < node.devices; device++) {
            const utilization = _.random(Math.max(node.utilization - 20, 0), Math.min(node.utilization + 20, 100))
            const memory_used = 0
            const memory_total = 0

            output.write(timestamp + ',' + node.name + ',' + device.toString() + ',' + utilization.toString() + ',' + memory_used.toString() + ',' + memory_total.toString() + '\n')
        }

        if (counter % args.randomness == 0) {
            node.utilization = Math.max(Math.min(node.utilization + _.random(-1, 1), 100), 0)
        }
    }

    time.setSeconds(time.getSeconds() + args.interval)
    counter++
}
