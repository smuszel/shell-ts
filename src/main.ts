import fgrep from './commands/fgrep';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const root = resolve('temp', 'fgrep_root');

const main = async () => {

    await fgrep.shx(root, /a/);
};

main();




