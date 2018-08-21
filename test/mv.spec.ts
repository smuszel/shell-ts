import mv from '../src/commands/mv';

import { promises as fsp } from 'fs';
import { expect, assert } from 'chai';
import { resolve, join, basename } from 'path';
import { exists } from '../src/helpers';
import { rimrafSync, promiseForPrompt } from './util';

const root = resolve('temp', 'mv_root');

const existingFile1 = join(root, 'abc1.txt');
const existingFile2 = join(root, 'abc2.txt');
const existingDir = join(root, 'abc');

const nonExistingWithin = join(root, 'xxx.txt');

const nonExistingWithout = join(root, 'remote', 'xxx.txt');


beforeEach('Content setup', async () => {
    await fsp.mkdir(root);
    await Promise.all([
        fsp.writeFile(existingFile1, 'abc'),
        fsp.writeFile(existingFile2, 'cba'),
        fsp.mkdir(existingDir)
    ]);
});

afterEach('Content removal', () => {
    rimrafSync(root);
});

describe('mv', () => {
    it('given empty source, throws', async () => {
        const a = await mv.shx(nonExistingWithin, nonExistingWithout).catch(() => 'throw');
        expect(a).to.equal('throw');
    })
    
    it('given destination without existing path, throws', async () => {
        const a = await mv.shx(existingFile1, nonExistingWithout).catch(() => 'throw');
        expect(a).to.equal('throw');
    })
    
    it('given destination as other file, throws', async () => {
        const a = await mv.shx(existingFile1, existingFile2).catch(() => 'throw');
        expect(a).to.equal('throw');
    })

    it('given empty destination with existing path, moves entry at source', async () => {
        await mv.shx(existingFile1, nonExistingWithin);
        const [sourceExists, destinationExists] = await Promise.all([
            exists(existingFile1),
            exists(nonExistingWithin)
        ]);
        
        expect(sourceExists).false;
        expect(destinationExists).true;
    })

    it('given destination as directory, attempts to move source inside', async () => {
        await mv.shx(existingFile1, existingDir);
        const sourceBasename = basename(existingFile1)
        const hopPath = join(existingDir, sourceBasename);

        const [
            sourceExists,
            destinationStat,
            sourceInDestination
        ] = await Promise.all([
            exists(existingFile1),
            fsp.stat(existingDir),
            exists(hopPath)
            ]);
        
        expect(sourceExists).false;
        expect(destinationStat.isDirectory()).true;
        expect(sourceInDestination).true;
    })
})

describe('mv -f', () => {

    it('given source as directory and destination as file, moves directory in place of file', async () => {
        await mv.f.shx(existingDir, existingFile1);

        const stat = await fsp.stat(existingFile1)
        expect(stat.isDirectory()).true;
    })

    it('given conflict, overwrites file in destination', async () => {
        const [content1Before, content2Before] = await Promise.all([
            fsp.readFile(existingFile1, 'utf8'),
            fsp.readFile(existingFile2, 'utf8'),
        ]);
        
        await mv.f.shx(existingFile1, existingFile2);
        
        const content2After = await fsp.readFile(existingFile2, 'utf8');
        const soureStillExists = await exists(existingFile1);

        expect(soureStillExists).false;
        expect(content2After).to.equal(content1Before);
        expect(content2After).to.not.equal(content2Before);

    })

    it('abc', () => {
        const assertRejection = (prom: Promise<any>) => {
            assert.isExtensible(prom.catch(() => ({})))
        }

        expect(true);
        expect(!!'').false;

        assertRejection(Promise.reject())
    }) 
})