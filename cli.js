#!/usr/bin/env node
'use strict'

const mri = require('mri')
const stations = require('db-stations')

const pkg = require('./package.json')
const createFilter = require('./lib/create-filter')
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
    db-stations "(s) => s.latitude > 53" "(s) => s.latitude > 12"
\n`)
	process.exit()
}

const showError = (err) => {
	console.error(err.message || (err + ''))
	process.exit(1)
}



let selector = Object.create(null)
if (Object.keys(selector).length === 0) selector = 'all'
else {
	if (argv.id) selector.id = argv.id.toString().trim()
	if ('latitude' in argv) selector.latitude = parseFloat(argv.latitude)
	if ('longitude' in argv) selector.longitude = parseFloat(argv.longitude)
	if ('weight' in argv) selector.weight = parseFloat(argv.weight)
}

const filters = [
	filterStream.obj(createFilter(selector))
]
for (let i = 0; i < argv._; i++) {
	const code = argv._[i]

	try {
		const filterFn = new Function(code)
		filters.push(filterStream.obj(filterFn))
	} catch (err) {
		showError(`Argument ${i} is not a valid JS function.`)
	}
}

const columns = (argv['columns'] || 'id,coords,weight,name').split(',')
const format = formats[argv.format](columns) || formats.pretty(columns)

pump(
	stations(),
	...filters,
	format,
	process.stdout,
	showError
)
