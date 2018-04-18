const DO_INLINE = false;

const DO_LOG = true;

const vulnRegex = /#+$/;
const slowString = '#'.repeat(10000) + '!';

function log (msg) {
	if (DO_LOG) {
		console.error(msg);
	}
}

/* Call if !DO_INLINE. */
function doTask () {
	for (let j = 0; j < 10; j++) {
		log(`  regex'ing iter ${j}`);
		vulnRegex.exec(slowString);
	}
}

function main () {
	console.error('Here we go!');
	for (let i = 0; i < 10; i++) {
		log(`Iter ${i}`);

		if (DO_INLINE) {
			for (let j = 0; j < 10; j++) {
				log(`  doTask'ing iter ${j}`);
				vulnRegex.exec(slowString);
			}
		}
		else {
			doTask();
		}
	}
}

main();
