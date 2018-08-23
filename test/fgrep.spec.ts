import { expect } from 'chai';
import { promises as fsp } from 'fs';
import { rejects, rimrafSync } from './util';
import fgrep from '../src/commands/fgrep';
import { resolve, join } from 'path';

const content1 = 'a';
const content2 = 'b';
const pattern = /a/;

const root = resolve('temp', 'fgrep_root');
const dir = join(root, 'aaa');

const file1 = join(root, 'x.ts');
const file2 = join(root, 'y.ts');
const file3 = join(dir, 'x.ts');

before('', async () => {
    await fsp.mkdir(root);
    await Promise.all([
        fsp.writeFile(file1, content1),
        fsp.writeFile(file2, content2),
        fsp.mkdir(dir)
    ]);

    await fsp.writeFile(file3, content1);
})

after('', () => {
    rimrafSync(root);
})

describe('grepf', () => {
    it('given path to directory, returns all files that contents satisfy pattern', async () => {
        const matchedFiles = await fgrep.shx(root, pattern);

        expect(matchedFiles).to.include(file1);
        expect(matchedFiles).to.include(file3);
        expect(matchedFiles).to.not.include(file2);
    })

    it('given path to file, throws', () => {
        rejects(fgrep.shx(file1, pattern))
    })
})