const DO_LOG = true;

function log (msg) {
	if (DO_LOG) {
		console.error(msg);
	}
}

function fib (n) {
	if (n <= 1) {
		return 1;
	}

	return fib(n-1) + fib(n-2);
}

function main () {
	for (let i = 0; i < 10; i++) {
		for (let j = 30; j < 40; j++) {
			const res = fib(j);
			log(`fib(${j}) = ${res}`);
		}
	}
}

main();
