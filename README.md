# node-profiling

This project documents my efforts to learn how to profile Node.js applications.

[Profiling](https://en.wikipedia.org/wiki/Profiling_(computer_programming)) means that you try to figure out what your application looks like as it runs.

# Getting started

Run `./configure` to configure and initialize the various directories and sub-modules.

# Layout

## techniques/

See `techniques/` for READMEs describing my experience with various techniques, including:
- The Linux [perf](https://perf.wiki.kernel.org/index.php/Main_Page) utility
- The [profiler](https://github.com/v8/v8/wiki/V8-Profiler) built into [V8](https://developers.google.com/v8/)
- [nearForm](https://www.nearform.com/)'s [node-clinic](https://github.com/nearform/node-clinic) project
- [NodeSource](https://nodesource.com/)'s [N|Solid](https://nodesource.com/products/nsolid) product

## benchmarks/

Benchmarks you can use to practice the different profiling techniques.
