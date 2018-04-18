const DO_JSON_INLINE = true;

const DO_LOG = true;

function log (msg) {
	if (DO_LOG) {
		console.error(msg);
	}
}

let bigObj = {};
let obj = bigObj;
for (let i = 0; i < 12; i++) {
	obj.a = 'a'.repeat(1000);
	obj.curr = JSON.stringify(bigObj);
	obj.child = {};
	obj = obj.child;
}

/* Call if !DO_JSON_INLINE. */
function doJSON () {
	for (let j = 0; j < 10; j++) {
		log(`  JSON'ing iter ${j}`);
		const str = JSON.stringify(bigObj);
		const obj = JSON.parse(str);
		log(`Big obj: string len ${str.length}`);
	}
}

function main () {
	console.error('Here we go!');
	for (let i = 0; i < 10; i++) {
		log(`Iter ${i}`);

		if (DO_JSON_INLINE) {
			for (let j = 0; j < 10; j++) {
				log(`  JSON'ing iter ${j}`);
				const str = JSON.stringify(bigObj);
				const obj = JSON.parse(str);
				log(`Big obj: string len ${str.length}`);
			}
		}
		else {
			doJSON();
		}
	}
}

main();
