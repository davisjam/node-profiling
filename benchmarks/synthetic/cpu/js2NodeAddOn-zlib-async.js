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
let nDeflate = 0;
let nGzip = 0;
let nDeflateDone = 0;
let nGzipDone = 0;
function doTask () {
	for (let j = 0; j < 10; j++) {
		log(`  zip'ing iter ${j}`);
		nDeflate++;
		zlib.deflate(bufToCompress, () => {
			nDeflateDone++;
			if (nDeflateDone % 10 === 0) {
				log(`  deflate: ${nDeflateDone}/${nDeflate} done`);
			}
		});

		nGzip++;
		zlib.gzip(bufToCompress, () => {
			nGzipDone++;
			if (nGzipDone % 10 === 0) {
				log(`  gzip: ${nGzipDone}/${nGzip} done`);
			}
		});
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
