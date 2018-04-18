const fs = require('fs');

const DO_LOG = true;
const N_READS = 500000; // Takes a few seconds on woody.

const fileToRead = __filename; // Read self

function log (msg) {
	if (DO_LOG) {
		console.error(msg);
	}
}

let nStarted = 0;
let nPending = 0;
let nDone = 0;
function doIO () {
	nStarted++
	nPending++;
	fs.readFile(fileToRead, () => {
		nDone++;
		nPending--;

		if (nDone % 1000 === 0) {
			log(`${nDone}/${nStarted} done (${nPending} pending)`);
		}
	});
}

function main () {
	for (let i = 0; i < N_READS; i++) {
		doIO();
	}

	log(`All IO queued`);
}

main();
