# db-stations-cli

**Find and filter [Deutsche Bahn](https://en.wikipedia.org/wiki/Deutsche_Bahn) stations from the command line.** The data is from [`db-stations`](https://github.com/derhuerst/db-stations).

[![asciicast](https://asciinema.org/a/148169.png)](https://asciinema.org/a/148169)

[![npm version](https://img.shields.io/npm/v/db-stations-cli.svg)](https://www.npmjs.com/package/db-stations-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/db-stations-cli.svg)
![minimum Node.js version](https://img.shields.io/node/v/db-stations-cli.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installing

```shell
npm install -g db-stations-cli
```

Or use [`npx`](https://npmjs.com/package/npx). ✨


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
    db-stations 'return s.weight > 2000'
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/db-stations-cli/issues).
