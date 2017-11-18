#!/usr/bin/env node
'use strict'

const mri = require('mri')
const createFilter = require('db-stations/create-filter')
const stations = require('db-stations')
const filterStream = require('stream-filter')
const pump = require('pump')

const pkg = require('./package.json')
const formats  = require('./lib/formats')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v']
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    db-stations [options] [filters]

Options:
    --id         <value>              Filter by id.
    --name       <value>              Filter by name.
    --latitude   <value>              Filter by latitude.
    --longitude  <value>              Filter by longitude.
    --weight     <value>              Filter by weight.
    --format     <csv|ndjson|pretty>  Default is pretty.
    --columns    <value>,<value>,…    Default is id,coords,weight,name.

Filters:
    Each filter must be an \`Array.prototype.filter\`-compatible funtion.

Examples:
    db-stations
    db-stations --name 'elfershausen trimberg'
    db-stations --id 8005229 --columns id,name,weight
    db-stations 'return s.weight > 2000'
\n`)
	process.exit()
}

const showError = (err) => {
	console.error(err.message || (err + ''))
	process.exit(1)
}



let selector = Object.create(null)
if (argv.id) selector.id = argv.id.toString().trim()
if (argv.name) selector.name = argv.name
if (argv.weight) selector.weight = argv.weight
if ('latitude' in argv) selector.latitude = parseFloat(argv.latitude)
if ('longitude' in argv) selector.longitude = parseFloat(argv.longitude)
if (Object.keys(selector).length === 0) selector = 'all'

const filters = [
	filterStream.obj(createFilter(selector))
]
for (let i = 0; i < argv._.length; i++) {
	const code = argv._[i]

	try {
		const filterFn = new Function('s', code)
		filters.push(filterStream.obj(filterFn))
	} catch (err) {
		showError(`Argument ${i} is not a valid JS function.`)
	}
}

const columns = (argv['columns'] || 'id,coords,weight,name').split(',')
const format = (formats[argv.format] || formats.pretty)(columns)

pump(
	stations(),
	...filters,
	format,
	process.stdout,
	showError
)
