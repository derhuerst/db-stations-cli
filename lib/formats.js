#!/usr/bin/env node
'use strict'

const duplexer = require('duplexer3')
const map = require('through2-map')
const toCsv = require('csv-write-stream')
const toNdjson = require('ndjson').toNdjson
// const toCsv = require('d3-dsv').csvFormat
// const pick = require('lodash.pick')
// const chalk    = require('chalk')
// const padRight   = require('pad-right')
// const shorten  = require('vbb-short-station-name')
// const padLeft    = require('pad-left')
// const truncate = require('cli-truncate')
// const cli = require('window-size')

const createFlatten = (columns) => {
	const flatten = (s) => {
		const r = Object.create(null)

		for (let col of columns) {
			if (col === 'coords') {
				r.latitude = s.coordinates.latitude
				r.longitude = s.coordinates.longitude
			} else r[col] = s[col]
		}

		return r
	}
	return flatten
}

const csv = (columns) => {
	const flatten = map.obj(createFlatten(columns))
	return duplexer(flatten, toCsv())
}

const ndjson = (columns) => {
	const flatten = map.obj(createFlatten(columns))
	return duplexer(flatten, toNdjson())
}

// const column = (value, pad, width) =>
// 	pad(truncate(value.toString(), width), width, ' ')

// const pretty = (columns, stations, out) => {
// 	for (let station of stations) {
// 		const line = []
// 		if (columns.id) line.push(chalk.blue(station.id))
// 		if (columns.coords) {
// 			if (station.coordinates) {
// 				line.push(chalk.gray(
// 					  column(station.coordinates.latitude, padRight, 9)
// 					+ ' '
// 					+ column(station.coordinates.longitude, padRight, 9)
// 				))
// 			} else line.push('')
// 		}
// 		if (columns.weight)
// 			line.push(chalk.green(column(station.weight, padLeft, 6)))
// 		if (columns.name)
// 			line.push(chalk.yellow(truncate(shorten(station.name), 35)))
// 		if (columns.lines && station.lines)
// 			line.push('  ' + station.lines.map((line) => line.name).join(' '))
// 		out.write(truncate(line.join(' '), cli.width || 80) + '\n')
// 	}
// }

module.exports = {csv, ndjson, pretty}
