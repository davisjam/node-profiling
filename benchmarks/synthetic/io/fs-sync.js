const fs = require('fs');

const DO_LOG = true;
const N_READS = 500000; // Takes a few seconds on woody.

const fileToRead = __filename; // Read self
let global = 0;

function log (msg) {
	if (DO_LOG) {
		console.error(msg);
	}
}

function doIO () {
	global++;
	fs.readFileSync(fileToRead);
}

function main () {
	for (let i = 0; i < N_READS; i++) {
		doIO();
	}

	log(`final global: ${global}`);
}

main();
