# Profiling with 0x

This is a guide to profiling Node.js applications with [0x](https://github.com/davidmarkclements/0x).

# What is 0x?

0x generates flamegraphs for Node.js applications.

# Why 0x?

0x is a one-stop-shop for flamegraph generation in Node.js.
It supports both "Event Loop Only" (V8 profiling) and "Full application" (perf profiling).

While getting V8 profiling to work is pretty easy, profiling with perf requires more effort.
0x offers a convenient CLI for both of these approaches.

# How does 0x work?

0x does exactly what you would expect:
- Event Loop Only profiling is implemented by running the application with the V8 profiling flags.
- Full Application profiling is implemented by invoking the appropriate tool on OSes that permit full-application tracing.

# How do I use 0x?

Run one of the commands below.

Once your workload is finished, Ctrl-C and 0x will display a flamegraph in your browser.
See the usage message for other behavior.

## Event Loop only

- Server: `0x server-cluster.js`
- Client: Run your client here.

What can you see from this view?

- You *can* see JS function calls in your application, e.g. to your calls or to Node.js core modules like zlib.
- You *cannot* see C++-land function calls, e.g. regex evaluations or JSON activity. (Strange, because using flamebearer you can see these?)

## Full application

- Server: `0x --kernel-tracing server-cluster.js`
- Client: Run your client here.

This will use OS support for application tracing.
On Linux it uses perf under the hood.

WARNING: Until [this issue](https://github.com/davidmarkclements/0x/issues/113) is resolved, this won't work well.
In fact, I haven't been able to make this mode work at all (on Ubuntu), even on my CPU-intensive synthetic benchmarks.
I suspect there is a bug in 0x's post-processing of `perf script`.
