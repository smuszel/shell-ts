import mv from '../src/commands/mv';
import { promises as fsp } from 'fs';
import { assert } from 'chai';
import { resolve, join, basename } from 'path';
import { exists } from '../src/helpers';
import { rejects } from './util';
import rimraf from 'rimraf';

const root = resolve('temp', 'mv_root');

const existingFile1 = join(root, 'abc1.txt');
const existingFile2 = join(root, 'abc2.txt');
const existingDir = join(root, 'abc');

const nonExistingWithin = join(root, 'xxx.txt');

beforeEach('Content setup', async () => {
    await fsp.mkdir(root);
    await Promise.all([
        fsp.writeFile(existingFile1, 'abc'),
        fsp.writeFile(existingFile2, 'cba'),
        fsp.mkdir(existingDir)
    ]);
});

afterEach('Content removal', () => {
    rimraf.sync(root);
});

describe('mv', () => {
    
    it('given empty destination with existing path, moves entry at source', async () => {
        await mv.shx(existingFile1, nonExistingWithin);
        const [sourceExists, destinationExists] = await Promise.all([
            exists(existingFile1),
            exists(nonExistingWithin)
        ]);
        
        assert(!sourceExists);
        assert(destinationExists);
    })

    it('given destination as other file, throws', async () => {
        rejects(mv.shx(existingFile1, existingFile2));
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
        
        assert(!sourceExists);
        assert(destinationStat.isDirectory());
        assert(sourceInDestination);
    })
})

describe('mv -f', () => {

    it('given source as directory and destination as file, overwrites', async () => {
        await mv.f.shx(existingDir, existingFile1);
        const stat = await fsp.stat(existingFile1);

        assert(stat.isDirectory());
    })

    it('given conflict, overwrites file in destination', async () => {
        const [content1Before, content2Before] = await Promise.all([
            fsp.readFile(existingFile1, 'utf8'),
            fsp.readFile(existingFile2, 'utf8'),
        ]);
        await mv.f.shx(existingFile1, existingFile2);
        
        const content2After = await fsp.readFile(existingFile2, 'utf8');
        const soureStillExists = await exists(existingFile1);

        assert(!soureStillExists);
        assert(content2After === content1Before);
        assert(content2After !== content2Before);
    })
})