# db-stations-cli

**Find and filter [Deutsche Bahn](https://en.wikipedia.org/wiki/Deutsche_Bahn) stations from the command line.** The data is from [`db-stations`](https://github.com/derhuerst/db-stations).

[![asciicast](https://asciinema.org/a/82500.png)](https://asciinema.org/a/82500)

[![npm version](https://img.shields.io/npm/v/db-stations-cli.svg)](https://www.npmjs.com/package/db-stations-cli)
[![build status](https://img.shields.io/travis/derhuerst/db-stations-cli.svg)](https://travis-ci.org/derhuerst/db-stations-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/db-stations-cli.svg)
[![chat on Gitter](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install -g db-stations-cli
```


## Usage

```
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
    Each filter must be an `Array.prototype.filter`-compatible funtion.

Examples:
    db-stations
    db-stations --name 'elfershausen trimberg'
    db-stations --id 8005229 --columns id,name,weight
    db-stations "(s) => s.latitude > 53" "(s) => s.latitude > 12"
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/db-stations-cli/issues).
