import { promises as fsp, existsSync } from 'fs';
import rm from '../src/commands/rm';
import { assert } from 'chai';
import { resolve, join } from 'path';
import { beforeEach } from 'mocha';
import { rejects } from './util';
const rimraf = require('rimraf');

const root = resolve('temp', 'rm_root');
const dir1 = join(root, 'aaa');
const dir2 = join(root, 'bbb');
const file = join(dir1, 'x.ts');

beforeEach('', async () => {
    await fsp.mkdir(root);

    await Promise.all([
        fsp.mkdir(dir1),
        fsp.mkdir(dir2),
    ]);

    await fsp.writeFile(file, 'a');
})

afterEach('', () => {
    rimraf.sync(root);
})


describe('rm', () => {

    it('given a file, disposes of it', async () => {
        await rm(file);
        const fileRemoved = !existsSync(file);

        assert(fileRemoved);
    })

    it('given directory throws', async () => {
        rejects(rm(dir1));
    })
})

describe('rm -rf', () => {

    it('given a file, disposes of it', async () => {
        await rm.rf(file);
        const fileRemoved = !existsSync(file);

        assert(fileRemoved);
    })
    
    it('given directory removes it with its contents', async () => {
        await rm.rf(dir1);
        const dirRemoved = !existsSync(dir1);
        
        assert(dirRemoved);
    })
})