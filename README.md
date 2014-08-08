# csv-denormal

Denormalize csv lines

## Usage

Meant to be passed to streams by `through`,

    var through = require('through');
    var csv = require('csv2');
    var csv_denormal = require('csv-denormal');
    
    process.stdin
    	.pipe(csv())
    	.pipe(through(csv_denormal()))
    	.pipe(process.stdout);

See also [markmontymark/iedb-myco-data](https://github.com/markmontymark/iedb-myco-data)
