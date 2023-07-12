### etchmory
a utility for persisting decisions made during an execution cycle. the need for this originally came about due to the randomness of generative art models within the [lignes](https://github.edede.ca/lignes) project. the idea was that by tracking the decisions made, they could be stored and replayed to produce the same works of art. this breakthrough would solve the problem of making models determinstic without having to redesign the api for writing them.

### walkthrough
this is not a usage guide but rather a conceptual example because the api is still very much in flux.

```ts
import { LinearMemory } from 'etchmory';

const memory = new LinearMemory();

/**
 A sample execution cycle to track.
 */
function main() {
  const shouldUseColor = Math.random() > 0.5;
  // mark this as critical for a repeatable run
  memory.mark('should use color', shouldUseColor);

  const numberOfChoices = Math.floor(Math.random() * 12);
  memory.mark('number of choices', numberOfChoices);

  // end of things to remember
  memory.complete();

  // save the run so it can be repeated later
  const token = memory.getToken(); 
}
```
