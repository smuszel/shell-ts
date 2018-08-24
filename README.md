### Example

    const someFolder = path.resolve('foo');
    const destination = path.resolve('temp', 'bar');

    await cp.rf(someFolder, destination); // copies directory foo recursively
    await rm.rf(someFolder) // cleans up
    const contents = await ls.r('temp'); // gets names of all files and directories


### Motivation

1. Learning async in node.js
2. Dabbing with typescript type system
3. Making unixy DSL-like interface
4. Excercising writing ascetic, clean code
