import { promises as fsp, existsSync } from 'fs';
import { assert } from 'chai';
import { resolve } from 'path';
import touch from '../src/commands/touch';
import rimraf from 'rimraf';

const root = resolve('temp', 'touch_root');

const existingFile = resolve(root, 'x.ts');
const emptySpace1 = resolve(root, 'y.ts');
const emptySpace2 = resolve(root, 'z.ts');

beforeEach('', async () => {
    await fsp.mkdir(root);
    await fsp.writeFile(existingFile, 'a');
})

afterEach('', () => {
    rimraf.sync(root);
})

describe('touch', () => {

    it('given non existing file, makes new file', async () => {
        await touch.shx(emptySpace1, emptySpace2);

        const file1Created = existsSync(emptySpace1);
        const file2Created = existsSync(emptySpace2);

        assert(file1Created);
        assert(file2Created);
    });

    it('given existing file, does not affect stats', async () => {        
        const statBefore = await fsp.stat(existingFile);
        await touch.shx(existingFile);

        await new Promise(rez => setTimeout(rez, 1));
        const statAfter = await fsp.stat(existingFile);

        assert.deepEqual(statBefore, statAfter);
    });

    it('given existing file, does not overwrite it', async () => {
        const contentBefore = await fsp.readFile(existingFile, 'utf8');
        await touch.shx(existingFile);
        const contentAfter = await fsp.readFile(existingFile, 'utf8');
        const sameContent = contentAfter === contentBefore;

        assert(sameContent);
    });
})