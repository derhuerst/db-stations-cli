#!/usr/bin/env node
'use strict'

const duplexer = require('duplexer3')
const map = require('through2-map')
const toCsv = require('csv-write-stream')
const toNdjson = require('ndjson').stringify
const through = require('through2')
const chalk = require('chalk')
const padR = require('pad-right')
const padL = require('pad-left')
const truncate = require('cli-truncate')
const cliWidth = require('window-size').width

const createFlatten = (columns) => {
	const flatten = (s) => {
		const r = Object.create(null)

		for (let col of columns) {
			if (col === 'coords') {
				if (s.coordinates) {
					r.latitude = s.coordinates.latitude
					r.longitude = s.coordinates.longitude
				}
			} else r[col] = s[col]
		}

		return r
	}
	return flatten
}

const csv = (columns) => {
	const flatten = map.obj(createFlatten(columns))
	return duplexer({objectMode: true}, flatten, flatten.pipe(toCsv()))
}

const ndjson = (columns) => {
	const flatten = map.obj(createFlatten(columns))
	return duplexer({objectMode: true}, flatten, flatten.pipe(toNdjson()))
}

const col = (val, padFn, width) => {
	return padFn((val + '').slice(0, width), width, ' ')
}

const pretty = (columns, stations, out) => {
	const colMap = Object.create(null)
	for (let col of columns) colMap[col] = true

	return through.obj((s, _, cb) => {
		const parts = []

		if (colMap.id) parts.push(chalk.blue(s.id))
		if (colMap.coords && s.coordinates) {
			parts.push(chalk.gray(
				col(s.coordinates.latitude, padL, 9) + ' ' +
				col(s.coordinates.longitude, padL, 9)
			))
		}
		if (colMap.weight) parts.push(chalk.green(col(s.weight, padL, 6)))
		if (colMap.name) parts.push(chalk.yellow(s.name.slice(0, 35)))

		const line = truncate(parts.join(' '), cliWidth || 80) + '\n'
		cb(null, line)
	})
}

module.exports = {csv, ndjson, pretty}
