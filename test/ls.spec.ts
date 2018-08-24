import { rejects } from './util';
import { promises as fsp } from 'fs';
import { expect, assert } from 'chai';
import { resolve, join } from 'path';
import ls from '../src/commands/ls';
const rimraf = require('rimraf');

const root = resolve('temp', 'ls_root');

const subdirectory1 = join(root, 'aaa');
const subdirectory2 = join(root, '.bbb');

const file1 = join(root, 'x.ts');
const file2 = join(subdirectory1, 'x.ts');
const file3 = join(subdirectory1, 'y.ts');
const file4 = join(subdirectory2, 'x.ts');

before('', async () => {
    await fsp.mkdir(root);

    await Promise.all([
        fsp.mkdir(subdirectory1),
        fsp.mkdir(subdirectory2)
    ]);

    await Promise.all([
        fsp.writeFile(file1, 'a'),
        fsp.writeFile(file2, 'b'),
        fsp.writeFile(file3, 'c'),
        fsp.writeFile(file4, 'd')
    ]);
});

after('', () => {
    rimraf.sync(root);
});

describe('ls', async () => {

    it('given a directory, returns shallow content absoulte names', async () => {
        const names = await ls(root);
        
        expect(names).to.include(file1);
        expect(names).to.include(subdirectory1);
        expect(names).to.include(subdirectory2);
        expect(names).to.not.include(file2);
    });

    it('given a file, throws', async () => {
        rejects(ls(file1));
    })
});

describe('ls -r', async () => {

    it('given a directory, returns all file names in that branch', async () => {
        const names = await ls.r(root);

        expect(names).to.include(file1);
        expect(names).to.include(file2);
        expect(names).to.include(file3);
        expect(names).to.include(file4);
    });

    it('given a directory, returns all directory names in that branch', async () => {
        const names = await ls.r(root);

        expect(names).to.include(subdirectory1);
        expect(names).to.include(subdirectory2);
    });

    it('given a directory, will not include its name in output', async () => {
        const names = await ls.r(root);

        expect(names).to.not.include(root);
    });

    it('given a file, throws', async () => {
        rejects(ls.r(file1));
    });
});