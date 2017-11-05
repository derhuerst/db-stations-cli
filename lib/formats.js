#!/usr/bin/env node
'use strict'

const duplexer = require('duplexer3')
const map = require('through2-map')
const toCsv = require('csv-write-stream')
const toNdjson = require('ndjson').toNdjson
const truncate = require('cli-truncate')
const through = require('through2')
const chalk = require('chalk')
const padR = require('pad-right')
const padL = require('pad-left')
const truncate = require('cli-truncate')
const cliWidth = require('window-size').width
const shorten = require('tokenize-db-station-name')

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
				col(s.coordinates.latitude, padR, 9) + ' ' +
				col(s.coordinates.longitude, padR, 9)
			))
		}
		if (columns.weight) parts.push(chalk.green(col(s.weight, padL, 6)))
		if (columns.name) parts.push(chalk.yellow(shorten(s.name).slice(0, 35)))

		const line = truncate(parts.join(' '), cliWidth || 80) + '\n'
		cb(null, line)
	})
}

module.exports = {csv, ndjson, pretty}
