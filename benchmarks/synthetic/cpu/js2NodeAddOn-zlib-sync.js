const zlib = require('zlib');

const DO_LOG = true;

// 5MB of #'s
const bufToCompress = Buffer.alloc(5*1024*1024, '#');

function log (msg) {
	if (DO_LOG) {
		console.error(msg);
	}
}

/* Call if !DO_INLINE. */
function doTask () {
	for (let j = 0; j < 10; j++) {
		log(`  zip'ing iter ${j}`);
		const deflated = zlib.deflateSync(bufToCompress);
		const gzipped = zlib.gzipSync(bufToCompress);
	}
}

function main () {
	console.error('Here we go!');
	for (let i = 0; i < 10; i++) {
		log(`Iter ${i}`);
		doTask();
	}
}

main();
