import rm from './commands/rm';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const root = resolve('temp', 'abc');
const d1 = join(root, 'aaa');
const d2 = join(root, 'bbb');

const f1 = join(d1, 'x.ts')

const setup = () => {
    mkdirSync(root)
    mkdirSync(d1)
    mkdirSync(d2)

    writeFileSync(f1, 'aaa')
}

const teardown = () => { };

const main = async () => {
    // setup();

    await rm.rf.shx(root);
};

main();




