"use strict";

//
// Taking a CSV file with format
// 	col1,col2,col3,col4,col5,col6,,,,,,,,,,colN
// Where col1 thru col5 exist in all lines, and then there are an optional
// number of values from col6 thru colN.  
// For each value found in col6 thru colN, duplicate col1 thru col4, append one value
// from col6 thru colN and send a new line
// 
// Example:
// 1,2,3,4,a
// 	results in one line 
// 		1,2,3,4,a
//
// 1,2,3,4,a,b,c,d
//  results in 4 files
//  	1.2,3,4,a
//  	1.2,3,4,b
//  	1.2,3,4,c
//  	1.2,3,4,d
//
var through = require('through');
var csv = require('csv2');

function denormalify(){
	var is_header_line = true;
	var lineno = 0;
	function pipe(chunk){
		lineno++;
		if(is_header_line){
			this.queue(new Buffer(chunk.toString()+"\n"));
			is_header_line = false;
		} 
		else {
			if(chunk.length < 5) {
				console.error("Found a line w/o enough columns. Line ",lineno,chunk.toString());
				return;
			}
			var line = chunk.slice(0,4);
			for(var i = 4 ; i < chunk.length; i++){
				if(chunk[i] && chunk[i].length > 0){
					var tmp = line.slice();
					tmp.push(chunk[i]);
					this.queue(new Buffer(tmp.toString()+"\n"));
				}
			}
		}
	}
	return pipe;
}

process.stdin
	.pipe(csv())
	.pipe(through(denormalify()))
	.pipe(process.stdout);
