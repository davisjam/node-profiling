# Profiling with perf

This is a guide to profiling Node.js applications with *perf*.

# What is perf?

Perf is a general-purpose way to monitor how an application interacts with the operating system. The easiest use case is to see how the CPU is used, perhaps to answer the question "What functions are often-used, or "hot"? But you can use perf for much more!

# Why perf?

The first problem in Node.js applications is [blocking the event loop](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/). V8 has a built-in profiler with which you can monitor the activity of the Event Loop. The [flamebearer](https://github.com/mapbox/flamebearer) project shows how to do this as of Node v8.5+:

```
$ node --prof app.js
$ node --prof-process --preprocess -j isolate*.log
```

For visualization purposes, you might want to pipe the output of the second command to [flamebearer](https://github.com/mapbox/flamebearer), or use the [0x project](https://github.com/davidmarkclements/0x).

However, Node.js applications are not V8 applications. Node.js's Event Loop uses V8, it's true, but it may also enter libuv synchronously (e.g. `fs.readFileSync`) or asynchronously (e.g. `fs.readFile`). Asynchronous operations end up on the [libuv threadpool](http://docs.libuv.org/en/v1.x/threadpool.html) and are invisible to V8 between queuing and completion. With perf you can get a bit more insight into what's happening in that threadpool.

# How does perf work?

At a high level, perf frequently samples your application's state to see "what it's up to". To do this it relies on Linux's perf\_events support in the kernel, and thus perf must run as root. You can also ask perf to monitor events of interest (e.g. page faults, scheduler decisions, etc.)

Perf can map CPU usage to functions in your program.
For applications that compile to machine code, it has no trouble.
But for applications that are interpreted or JIT-compiled, perf needs a bit of help.
Node.js is interpreted and/or JIT-compiled, so we have to give perf a hand by asking Node (via a V8 flag) to emit a mapping from the code addresses that perf sees to the corresponding JavaScript code.

As of Node v8, these flags are:
- --perf-basic-prof (Enable perf linux profiler (basic support).)
- --perf-basic-prof-only-functions (Only report function code ranges to perf (i.e. no stubs).)

Let's see what these flags do.

## node --perf-basic-prof

Let's start the Node.js REPL loop. Looks like we got pid 8839.

```
(18:07:33) jamie@woody ~/Desktop/node-profiling/techniques/perf $ node --perf-basic-prof 
> process.pid
8839
```

Thanks to --perf-basic-prof, Node.js (V8) emits a mapping from addresses to function names.
That mapping is placed in the file `/tmp/perf-PID.map`.

```
(18:07:47) jamie@woody ~/Desktop/node-profiling/techniques/perf $ wc -l /tmp/perf-8839.map
2624 /tmp/perf-8839.map
(18:08:01) jamie@woody ~/Desktop/node-profiling/techniques/perf $ cat /tmp/perf-8839.map
183e59f84060 f6 Stub:JSEntryStub
183e59f841c0 f6 Stub:JSEntryStub
183e59f84320 26 Builtin:EmptyFunction
183e59f843c0 11e Stub:CEntryStub
183e59f84540 2b Builtin:ConstructedNonConstructable
183e59f845e0 11e Stub:CEntryStub
183e59f84760 33b Builtin:CompileLazy
183e59f84b00 4ee Stub:RecordWriteStub
183e59f85060 48 Stub:StoreBufferOverflowStub
183e59f85120 50a Stub:RecordWriteStub
...
```

## node perf-basic-prof-only-functions

Same idea as --perf-basic-prof, but now we get:

```
(18:11:05) jamie@woody ~/Desktop/node-profiling/techniques/perf $ node --perf-basic-prof-only-functions
> process.pid
8917
> (18:11:12) jamie@woody ~/Desktop/node-profiling/techniques/perf $ wc -l /tmp/perf-8917.map 
815 /tmp/perf-8917.map
(18:11:25) jamie@woody ~/Desktop/node-profiling/techniques/perf $ cat /tmp/perf-8917.map 
2dba03e30d46 8 Script:~ bootstrap_node.js:1
2dba03e322f6 185 Function:~ bootstrap_node.js:10
2dba03e3621e 99d Function:~startup bootstrap_node.js:12
2dba03e3621e 99d LazyCompile:~startup bootstrap_node.js:12
2dba03e3808e c0 Function:~NativeModule.require bootstrap_node.js:516
2dba03e3808e c0 LazyCompile:~NativeModule.require bootstrap_node.js:516
2dba03e3844e 11 Function:~NativeModule.getCached bootstrap_node.js:546
...
```

This file has the same format as from --perf-basic-prof, but it only reports the highlights.
Note that we ran the same program (REPL) but the perf map contains 815 mappings instead of 2624.

# How perf? 

TODO I am here.

## Record

You can monitor a Node.js application start-to-finish using `perf record PERF_ARGS -- node XXX`.

# Perf documentation

In order of increasing complexity:
- b0rk's [cartoon guide](https://jvns.ca/blog/2018/04/16/new-perf-zine/)
- brendangregg's [detailed guide](http://brendangregg.com/perf.html)
- Linux [Wiki](https://perf.wiki.kernel.org/index.php/Main_Page)
