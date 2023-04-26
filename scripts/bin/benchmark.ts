import type { Script } from "../runner";
import { PerformanceObserver, performance } from "perf_hooks";
import { ensureDistExists, getDistDir } from "../utils";

const obs = new PerformanceObserver((items: { getEntries: () => any[] }) => {
  const results = {
    linear: {},
    graph: {},
  };

  items.getEntries().forEach((entry) => {
    let result: Record<string, any> = {};
    let name: string;

    if (entry.name.startsWith("LinearMemory")) {
      result = results.linear;
      name = entry.name.replace("LinearMemory:", "");
    } else if (entry.name.startsWith("GraphMemory")) {
      result = results.graph;
      name = entry.name.replace("GraphMemory:", "");
    }

    if (!result || !name) {
      return;
    }

    const [fn, iterations] = name.split(" ");

    if (!result[fn]) {
      result[fn] = {};
    }

    if (!result[fn][iterations]) {
      result[fn][iterations] = [];
    }

    result[fn][iterations].push(entry);
  });

  const formatDuration = (duration: number) => {
    return `${duration.toFixed(2)}ms`;
  };

  // format the results into a table
  const formatResults = (
    results: Record<
      string,
      { [key: string]: [{ name: string; duration: number }] }
    >
  ) => {
    const table: Record<string, any> = {};

    for (const [fn, iterations] of Object.entries(results)) {
      for (const [iteration, [entry]] of Object.entries(iterations)) {
        if (!table[iteration]) {
          table[iteration] = {};
        }
        table[iteration][fn] = formatDuration(entry.duration);
      }
    }

    return table;
  };

  const linearResults = formatResults(results.linear);
  const graphResults = formatResults(results.graph);

  console.log("\nBenchmark Results\n");
  console.log("LinearMemory");
  console.table(linearResults);
  console.log("GraphMemory");
  console.table(graphResults);

  performance.clearMarks();
});
obs.observe({ type: "measure" });

interface BenchmarkOptions {
  tag: string;
  cycles: number;
  run: () => void;
  afterEach?: () => void;
  beforeAll?: () => void;
}

function benchmark(options: BenchmarkOptions) {
  return new Promise((resolve) => {
    options.beforeAll && options.beforeAll();

    performance.mark(`[${options.tag}] start`);
    for (let i = 0; i < options.cycles; i++) {
      options.run();
      options.afterEach && options.afterEach();
    }
    performance.mark(`[${options.tag}] end`);
    performance.measure(
      options.tag,
      `[${options.tag}] start`,
      `[${options.tag}] end`
    );
    resolve(null);
  });
}

async function run() {
  ensureDistExists();
  const { LinearMemory, GraphMemory } = await import(getDistDir());

  type MemoryObject = typeof LinearMemory | typeof GraphMemory;

  interface BenchmarkHandle {
    get: () => MemoryObject;
    reset: () => void;
  }

  interface MemoryBenchmarkOptions {
    tag: string;
    cycles: number[];
    run: (memory: MemoryObject) => void;
    beforeAll?: (handle: BenchmarkHandle) => void;
    afterEach?: (handle: BenchmarkHandle) => void;
  }

  async function performMemoryObjectBenchmark(options: MemoryBenchmarkOptions) {
    const makeBenchmarkFn = async (
      name: string,
      constructor: () => MemoryObject,
      cycles: number
    ) => {
      let m = constructor();

      const handle = {
        get: () => m,
        reset: () => {
          m = constructor();
        },
      };

      await benchmark({
        tag: `${name}:${options.tag} x${cycles}`,
        cycles,
        run: () => {
          options.run(handle.get());
        },
        beforeAll: () => {
          options.beforeAll && options.beforeAll(handle);
        },
        afterEach: () => {
          options.afterEach && options.afterEach(handle);
        },
      });
    };

    for (const count of cycles) {
      await Promise.all([
        makeBenchmarkFn("LinearMemory", () => new LinearMemory(), count),
        makeBenchmarkFn("GraphMemory", () => new GraphMemory(), count),
      ]);
    }
  }

  const cycles = [10, 100, 1000, 10000, 100000];

  async function performMarkBenchmark() {
    return await performMemoryObjectBenchmark({
      tag: "mark",
      cycles,
      run: (memory) => {
        memory.mark(makeString(), makeString());
      },
      afterEach: ({ get, reset }) => {
        get().complete();
        reset();
      },
    });
  }

  async function performRecallBenchmark() {
    let keys: string[] = [];

    return await performMemoryObjectBenchmark({
      tag: "recall",
      cycles,
      beforeAll: ({ reset, get }) => {
        keys = [];
        const memory = get();
        for (let i = 0; i < 1000; i++) {
          const key = makeString();
          memory.mark(key, makeString());
          keys.push(key);
        }
        memory.complete();
      },
      run: (m) => {
        const key = keys[Math.floor(Math.random() * keys.length)];
        m.recall(key);
      },
    });
  }

  async function performReplayBenchmark() {
    return await performMemoryObjectBenchmark({
      tag: "replay",
      cycles,
      beforeAll: ({ reset, get }) => {
        const memory = get();
        for (let i = 0; i < 1000; i++) {
          memory.mark(makeString(), makeString());
        }
        memory.complete();
      },
      run: (m) => {
        const sequence = m.replay();
        while (sequence.next().done === false) {
          // noop
        }
      },
    });
  }

  await Promise.all([
    performMarkBenchmark(),
    performRecallBenchmark(),
    performReplayBenchmark(),
  ]);
}

function makeString() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

const BenchmarkScript: Script = {
  name: "benchmark",
  run,
};

export default BenchmarkScript;
