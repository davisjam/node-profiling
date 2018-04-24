# techniques/

Welcome to my notes on profiling Node.js applications with various techniques.
Visit each subdirectory for details on that technique.

# Types of techniques

There are two general classes of techniques for profiling:
1. Big-picture application health (n|solid, node-clinic, etc.)
2. Fine-grained application performance (0x, flamebearer, perf, etc.)

# Which technique should I use?

These are my preferences. Your mileage may vary.

| Need | Recommended technique |
|------|-----------------------|
| Check the overall health of my Node.js server | nsolid ($$) or node-clinic (OSS) |
| See where my event loop spends its time | 0x |
| See how the threadpool is doing | ??? |
